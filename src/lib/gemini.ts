// lib/gemini.ts — versão refatorada
// Chama /api/gemini (rota interna do Next.js) em vez da API do Google diretamente.
// A chave de API fica APENAS no servidor (.env.local / Vercel env vars).

import { ExercicioLacuna, ExercicioPuzzle, Pergunta } from '@/types';

// ─── Prompts ──────────────────────────────────────────────────────────────────

const PROMPT_LACUNA = `Você é um professor especialista em Portugol (linguagem de programação educacional brasileira).
Gere exercícios do tipo "Código com Lacunas" para alunos iniciantes.

REGRAS IMPORTANTES DO PORTUGOL:
- O comando de saída é "escreva" (NÃO "escreval"). Use apenas "escreva".
- O comando de entrada é "leia".
- Tipos: inteiro, real, cadeia, logico, caractere.
- Atribuição: usa "=" (igual).
- Condicionais: "se", "senao".
- Laços: "para", "enquanto", "faca...enquanto".
- Operadores lógicos: "e", "ou", "nao".
- Todo programa começa com "programa { funcao inicio() { ... } }".
- Strings são delimitadas por aspas duplas.

Cada exercício DEVE seguir EXATAMENTE este formato JSON:
{
  "id": "lac-ai-X",
  "titulo": "Título do exercício",
  "descricao": "Breve descrição do que o aluno deve fazer",
  "xpMaximo": 100,
  "codigoTemplate": "código portugol com __LACUNA_1__, __LACUNA_2__ nos espaços",
  "lacunas": [
    { "id": "LACUNA_1", "dica": "Dica para o aluno", "tamanhoVisual": 6 }
  ],
  "respostasCorretas": { "LACUNA_1": "resposta_exata" },
  "entradaSimulada": ["valor1"],
  "outputEsperado": "saída esperada",
  "dificuldade": "facil"
}

Responda APENAS com um array JSON válido. Sem markdown, sem explicações extras.`;

const PROMPT_PUZZLE = `Você é um professor especialista em Portugol (linguagem de programação educacional brasileira).
Gere exercícios do tipo "Quebra-Cabeça de Código" onde o aluno arrasta blocos para montar o programa.

REGRAS IMPORTANTES DO PORTUGOL:
- O comando de saída é "escreva" (NÃO "escreval"). Use apenas "escreva".
- O comando de entrada é "leia".
- Tipos: inteiro, real, cadeia, logico, caractere.
- Atribuição: usa "=" (igual).
- Todo programa começa com "programa { funcao inicio() { ... } }".

Formato esperado:
{
  "id": "puz-ai-X",
  "titulo": "Título",
  "descricao": "Descrição",
  "xpMaximo": 150,
  "codigoTemplate": "código com __SLOT_1__ nos espaços",
  "slots": [{ "id": "SLOT_1", "tamanhoVisual": 15 }],
  "blocos": [
    { "id": "b1", "conteudo": "código do bloco", "ehDistrator": false },
    { "id": "b-dist1", "conteudo": "bloco errado", "ehDistrator": true }
  ],
  "respostasCorretas": { "SLOT_1": "b1" },
  "entradaSimulada": ["5"],
  "outputEsperado": "saída esperada",
  "dificuldade": "facil"
}

REGRAS: 3-5 slots por exercício, pelo menos 2 blocos distratores.
Responda APENAS com um array JSON válido. Sem markdown, sem explicações extras.`;

const PROMPT_QUIZ = `Você é um professor especialista em Portugol (linguagem de programação educacional brasileira).
Gere perguntas de Quiz sobre programação em Portugol.

REGRAS: O comando de saída é "escreva". Atribuição usa "=". Tipos: inteiro, real, cadeia, logico.

Formato esperado:
{
  "id": "q-ai-X",
  "tipo": "multipla_escolha",
  "enunciado": "Texto da pergunta",
  "codigoIlustrativo": "código opcional",
  "opcoes": [
    { "id": "a", "texto": "Opção A", "correta": false, "explicacao": "Motivo" },
    { "id": "b", "texto": "Opção B", "correta": true, "explicacao": "Motivo" },
    { "id": "c", "texto": "Opção C", "correta": false },
    { "id": "d", "texto": "Opção D", "correta": false }
  ],
  "xpBase": 50,
  "tempoBonusSegundos": 15,
  "dificuldade": "facil",
  "categoria": "categoria"
}

REGRAS: 4 opções, exatamente 1 correta. Responda APENAS com um array JSON válido.`;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoExercicio = 'lacuna' | 'puzzle' | 'quiz';

// ─── Função principal ─────────────────────────────────────────────────────────

export async function gerarExercicios(
  tipo: TipoExercicio,
  tema: string,
  quantidade: number,
  dificuldade: string
  // ⚠️  apiKey foi REMOVIDO — agora fica no servidor via variável de ambiente
): Promise<{ exercicios: unknown[]; erro?: string }> {
  const promptBase =
    tipo === 'lacuna' ? PROMPT_LACUNA :
    tipo === 'puzzle' ? PROMPT_PUZZLE :
    PROMPT_QUIZ;

  const tipoNome =
    tipo === 'lacuna' ? 'Lacunas' :
    tipo === 'puzzle' ? 'Quebra-Cabeça' :
    'Quiz';

  const ts = Date.now();
  const prompt = `${promptBase}

TAREFA: Gere exatamente ${quantidade} exercício(s) de ${tipoNome} sobre o tema: "${tema}".
Dificuldade: ${dificuldade}.
IDs únicos: use "${tipo === 'lacuna' ? 'lac' : tipo === 'puzzle' ? 'puz' : 'q'}-ai-${ts}-1", "-2", etc.

Responda APENAS com um array JSON válido, sem markdown, sem explicações.`;

  try {
    // Chama a rota interna do Next.js — nunca a API do Google diretamente
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { exercicios: [], erro: data.erro ?? `Erro ${res.status}` };
    }

    let cleanText: string = (data.texto ?? '').trim();
    // Remove fences markdown se a IA incluir mesmo sem instrução
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const exercicios = JSON.parse(cleanText);

    if (!Array.isArray(exercicios)) {
      throw new Error('A IA não retornou um array válido.');
    }

    return { exercicios };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { exercicios: [], erro: message };
  }
}