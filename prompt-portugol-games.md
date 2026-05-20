# Prompt Completo — Projeto "Portugol Games"

> Cole este prompt inteiro em um agente de IA (Cursor, Windsurf, Claude Code, etc.) para construir o projeto do zero.

---

## Contexto e objetivo

Crie um projeto web completo chamado **Portugol Games** — uma plataforma de minigames educativos para ensinar programação com **Portugol Web Studio**. A plataforma será usada por alunos em sala de aula, com foco em exercícios interativos e gamificação.

O projeto deve ser **totalmente funcional, visualmente bonito e responsivo**, pronto para deploy na **Vercel** sem nenhum backend ou banco de dados. Toda a persistência de dados durante a sessão deve usar `localStorage`.

---

## Stack tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **Drag and Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Exportação de planilha**: SheetJS (xlsx)
- **Deploy**: Vercel (sem backend, sem banco de dados)
- **Portugol**: Embutido via iframe do Portugol Web Studio Online (`https://portugol.dev` ou iframe local com o bundle do Portugol Web Studio)

---

## Estrutura de pastas

```
portugol-games/
├── app/
│   ├── page.tsx                  # Tela de login/entrada
│   ├── menu/page.tsx             # Menu de seleção de minigames
│   ├── game/
│   │   ├── lacunas/page.tsx      # Minigame 1: Código com lacunas
│   │   ├── quebra-cabeca/page.tsx # Minigame 2: Arrastar blocos
│   │   └── quiz/page.tsx         # Minigame 3: Questionário
│   └── ranking/page.tsx          # Tela de ranking final
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── portugol/
│   │   ├── CodeEditor.tsx        # Editor com lacunas
│   │   ├── CodeRunner.tsx        # Executor do código (iframe Portugol)
│   │   ├── DragBlock.tsx         # Bloco arrastável
│   │   └── OutputPanel.tsx       # Painel de saída / erro
│   ├── game/
│   │   ├── ScoreBar.tsx          # Barra de pontuação atual
│   │   ├── Timer.tsx             # Cronômetro por exercício
│   │   ├── FeedbackModal.tsx     # Modal de acerto/erro
│   │   └── ProgressBar.tsx       # Progresso no minigame
│   └── ranking/
│       ├── Podium.tsx            # Pódio animado top 3
│       └── RankingTable.tsx      # Tabela completa
├── data/
│   ├── exercises-lacunas.ts      # Exercícios do minigame 1
│   ├── exercises-puzzle.ts       # Exercícios do minigame 2
│   └── quiz-questions.ts         # Perguntas do questionário
├── lib/
│   ├── storage.ts                # Funções de localStorage
│   ├── scoring.ts                # Lógica de pontuação e XP
│   └── export.ts                 # Exportação xlsx com SheetJS
└── types/
    └── index.ts                  # Tipos TypeScript globais
```

---

## Fluxo da aplicação

### 1. Tela de entrada (`/`)
- Campo para o aluno digitar **nome completo** e **turma/sala**
- Botão "Entrar e jogar"
- Salva `{ nome, turma, iniciadoEm }` no localStorage
- Redireciona para o menu

### 2. Menu de minigames (`/menu`)
- Exibe os 3 minigames disponíveis em cards grandes
- Cada card mostra: ícone, nome do jogo, descrição curta, XP máximo possível
- Mostra o progresso do aluno (quantos já completou)
- Botão "Ver Ranking" no canto superior direito

---

## Minigame 1 — Código com Lacunas (`/game/lacunas`)

### Descrição
O aluno vê um código Portugol com partes **ocultas** substituídas por campos de texto editáveis (inputs inline). Após preencher todas as lacunas, ele clica em "Executar" e o código roda no Portugol Web Studio embutido.

### Comportamento
- Se o código rodar **sem erros e produzir a saída esperada** → exibe modal de acerto com XP ganho
- Se o código rodar **com erro ou saída incorreta** → exibe o erro com destaque na linha, dica de qual lacuna está errada
- O aluno pode tentar **quantas vezes quiser**, mas perde XP a cada tentativa adicional (máx. 3 tentativas para XP total, depois XP parcial)
- Cada lacuna incorreta fica destacada em vermelho após a tentativa

### Componente `CodeEditor`
- Renderiza o código Portugol com as lacunas como `<input>` inline estilizados
- As lacunas têm largura dinâmica proporcional ao tamanho esperado
- Realce de sintaxe nas partes não-editáveis (use Prism.js ou highlight.js)
- Fonte monoespaçada (ex: JetBrains Mono ou Fira Code via Google Fonts)

### Integração com Portugol Web Studio
- Ao clicar em "Executar":
  1. Monta o código completo substituindo os inputs pelos valores digitados
  2. Envia o código para o Portugol Web Studio via `postMessage` para um iframe oculto
  3. Captura a saída (stdout) e erros via `postMessage` de volta
  4. Compara a saída com `outputEsperado` definido no exercício
- Se o Portugol Web Studio não suportar iframe + postMessage, use uma abordagem alternativa: **execute o código num worker JavaScript que simule as operações básicas do Portugol** (escreva um mini-interpretador para os comandos mais comuns: `escreva`, `leia`, `se`, `enquanto`, `para`, variáveis inteiro/real/cadeia/logico)

### Estrutura de dados dos exercícios (`exercises-lacunas.ts`)
```typescript
interface ExercicioLacuna {
  id: string
  titulo: string
  descricao: string
  xpMaximo: number
  codigoTemplate: string  // usar __LACUNA_1__, __LACUNA_2__ etc como marcadores
  lacunas: {
    id: string            // ex: "LACUNA_1"
    dica: string          // ex: "tipo de variável para número inteiro"
    tamanhoVisual: number // em caracteres, para definir largura do input
  }[]
  respostasCorretas: Record<string, string>  // { LACUNA_1: "inteiro", LACUNA_2: "escreva" }
  entradaSimulada: string[]   // valores que serão "digitados" na entrada
  outputEsperado: string      // saída esperada exata
  dificuldade: 'facil' | 'medio' | 'dificil'
}
```

### Exemplos de exercícios para criar
Crie pelo menos **5 exercícios** variados cobrindo:
1. Declaração de variáveis e `escreva`
2. Leitura com `leia` e operações aritméticas
3. Estrutura `se/senao`
4. Estrutura `enquanto`
5. Estrutura `para`

---

## Minigame 2 — Quebra-Cabeça de Código (`/game/quebra-cabeca`)

### Descrição
O aluno vê uma estrutura de código Portugol com **espaços em branco** (zonas de drop). À direita (ou abaixo em mobile), há **blocos de código** embaralhados que ele precisa arrastar para os espaços corretos.

### Comportamento
- Usa **@dnd-kit** para drag and drop
- Os blocos podem ser arrastados de volta para a área de blocos disponíveis (desfazer)
- Ao clicar "Verificar e Executar":
  - Monta o código com os blocos nas posições indicadas
  - Executa no Portugol (mesma lógica do minigame 1)
  - Acerto → XP + feedback positivo
  - Erro → mostra qual bloco está no lugar errado (destaque visual) + dica
- Inclui blocos **distratores** (blocos que não fazem parte do código correto) para aumentar a dificuldade

### Layout
```
┌─────────────────────────────┬──────────────────┐
│  CÓDIGO (com zonas de drop) │  BLOCOS           │
│                             │  disponíveis      │
│  programa {                 │  ┌─────────────┐  │
│    funcao inicio() {        │  │ inteiro x   │  │
│      [  DROP AQUI  ]        │  └─────────────┘  │
│      x <- [  DROP  ]        │  ┌─────────────┐  │
│      escreva(x)             │  │ real x      │  │
│    }                        │  └─────────────┘  │
│  }                          │  ...              │
└─────────────────────────────┴──────────────────┘
```

### Estrutura de dados (`exercises-puzzle.ts`)
```typescript
interface ExercicioPuzzle {
  id: string
  titulo: string
  descricao: string
  xpMaximo: number
  codigoTemplate: string   // usa __SLOT_1__, __SLOT_2__ etc
  slots: {
    id: string             // ex: "SLOT_1"
    tamanhoVisual: number
  }[]
  blocos: {
    id: string
    conteudo: string       // ex: "inteiro x"
    ehDistrator: boolean
  }[]
  respostasCorretas: Record<string, string>  // { SLOT_1: "bloco-id-3" }
  entradaSimulada: string[]
  outputEsperado: string
  dificuldade: 'facil' | 'medio' | 'dificil'
}
```

Crie pelo menos **4 exercícios** de quebra-cabeça, cada um com 3-6 slots e 2-3 distratores.

---

## Minigame 3 — Questionário (`/game/quiz`)

### Descrição
Série de perguntas de múltipla escolha (ou verdadeiro/falso) sobre Portugol e lógica de programação.

### Comportamento
- Exibe **uma pergunta por vez** com transição animada (Framer Motion)
- Opções de resposta em cards clicáveis
- Após selecionar: feedback imediato (verde = correto, vermelho = errado) com explicação
- Cronômetro opcional por pergunta (configurável no arquivo de dados)
- Bônus de XP para respostas rápidas (menos de X segundos)
- Ao final: tela de resumo com % de acertos e XP total

### Tipos de pergunta suportados
```typescript
interface Pergunta {
  id: string
  tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'ordenar'  // ordenar = opcional/bônus
  enunciado: string
  codigoIlustrativo?: string   // trecho de código para mostrar junto à pergunta
  opcoes: {
    id: string
    texto: string
    correta: boolean
    explicacao?: string        // mostrado após resposta
  }[]
  xpBase: number
  tempoBonusSegundos?: number  // se responder antes deste tempo, ganha XP extra
  dificuldade: 'facil' | 'medio' | 'dificil'
  categoria: string            // ex: "variáveis", "estruturas de controle", "funções"
}
```

Crie pelo menos **15 perguntas** variadas cobrindo:
- Tipos de dados em Portugol
- Operadores aritméticos, relacionais e lógicos
- Estruturas condicionais (`se`, `escolha`)
- Estruturas de repetição (`enquanto`, `para`, `faca enquanto`)
- Vetores e matrizes
- Funções e procedimentos
- Boas práticas de programação

---

## Sistema de Pontuação e XP

### Arquivo `lib/scoring.ts`

```typescript
// XP base por minigame
const XP_BASE = {
  lacunas: 100,
  puzzle: 150,
  quiz: 50       // por pergunta
}

// Multiplicadores
const MULTIPLICADORES = {
  primeiraVez: 1.0,        // 100% do XP
  segundaTentativa: 0.7,   // 70% do XP
  terceiraTentativa: 0.5,  // 50% do XP
  aposIso: 0.25,           // 25% do XP
}

// Bônus
const BONUS = {
  semErros: 50,            // XP extra por completar sem nenhum erro
  rapido: 25,              // XP extra por responder antes do tempo bônus
  streakCorreta: 10,       // XP extra por cada acerto consecutivo no quiz
}
```

### Estrutura do perfil do aluno no localStorage
```typescript
interface PerfilAluno {
  nome: string
  turma: string
  iniciadoEm: string        // ISO timestamp
  xpTotal: number
  minigamesCompletados: {
    lacunas: ResultadoMinigame | null
    puzzle: ResultadoMinigame | null
    quiz: ResultadoMinigame | null
  }
}

interface ResultadoMinigame {
  completadoEm: string
  xpGanho: number
  tentativas: number
  acertos: number
  totalQuestoes: number
  tempoSegundos: number
}
```

---

## Tela de Ranking (`/ranking`)

### Pódio animado (top 3)
- Posição 2 (prata) à esquerda, posição 1 (ouro) no centro (mais alta), posição 3 (bronze) à direita
- Animação de entrada: os pódios "sobem" da base com Framer Motion
- Cada posição mostra: avatar com iniciais colorido, nome, turma, XP total, medalha emoji
- Efeito especial para o 1º lugar (confetti com canvas-confetti ou CSS puro)

### Tabela completa
- Todos os alunos ordenados por XP
- Colunas: posição, nome, turma, lacunas, quebra-cabeça, quiz, XP total, tempo total
- Highlight nas linhas 1-3 com cores de ouro/prata/bronze
- Pesquisa por nome ou turma

### Botão "Exportar Resultados (.xlsx)"
- Usa SheetJS para gerar a planilha
- Aba 1: "Ranking Geral" — todos os alunos com XP total
- Aba 2: "Detalhes" — uma linha por aluno por minigame com todos os dados
- Aba 3: "Estatísticas" — médias, maior XP, % de conclusão por minigame
- Nome do arquivo: `ranking-portugol-games-YYYY-MM-DD.xlsx`

### Implementação do ranking
Como não há backend, o ranking é **colaborativo via localStorage compartilhado** — cada aluno que usa o mesmo dispositivo/navegador aparece no ranking. Para turmas com dispositivos diferentes, o professor pode:
1. Exportar o xlsx de cada máquina
2. Usar a função de importação (adicionar botão "Importar resultados de outro xlsx")
3. O sistema mescla os dados e exibe o ranking unificado

---

## Componente de Execução Portugol

### Estratégia principal: Mini-interpretador JavaScript

Como o Portugol Web Studio pode ter limitações de iframe, implemente um **mini-interpretador de Portugol em JavaScript puro** no arquivo `lib/portugol-interpreter.ts`:

```typescript
// Deve suportar:
// - Declaração: inteiro x, real y, cadeia s, logico b
// - Atribuição: x <- 10
// - Saída: escreva("texto", x), escrevaln(...)
// - Entrada: leia(x)  — usa array de inputs pré-definidos
// - Aritmética: +, -, *, /, % (resto), ^ (potência)
// - Comparação: ==, !=, >, <, >=, <=
// - Lógica: e, ou, nao
// - Condicional: se (cond) { ... } senao { ... }
// - Repetição: enquanto (cond) { ... }
// - Repetição: para x de A ate B passo C { ... }
// - Repetição: faca { ... } enquanto (cond)
// - Funções matemáticas: raiz(x), potencia(b,e), absoluto(x)

interface ResultadoExecucao {
  sucesso: boolean
  saida: string[]         // linhas de output
  erro?: {
    mensagem: string
    linha: number
  }
  entradaConsumida: string[]
}

function executarPortugol(
  codigo: string,
  entradas: string[]     // valores a serem consumidos pelo leia()
): ResultadoExecucao
```

### Estratégia alternativa: iframe Portugol Web Studio
Se quiser usar o Portugol real, tente:
1. Carregar `https://portugol.dev` em um iframe oculto
2. Usar `postMessage` para enviar o código e receber a saída
3. Implementar fallback para o mini-interpretador se o iframe falhar

---

## Design e UI

### Tema visual
- Paleta principal: roxo/violeta (`#7C3AED`) + azul (`#3B82F6`) + verde sucesso + vermelho erro
- Fundo escuro suave (modo escuro como padrão, com toggle)
- Cards com bordas arredondadas grandes, sombras suaves
- Fontes: **Inter** para UI + **JetBrains Mono** para código
- Animações suaves em todas as transições de tela (Framer Motion)

### Elementos de gamificação visuais
- Barra de XP animada que "enche" após cada exercício
- Badges para conquistas: "Primeiro acerto", "Sem erros", "Velocista", "Completo"
- Sons opcionais (Web Audio API): ding para acerto, buzz para erro, fanfarra no pódio
- Partículas de confetti no ranking (1º lugar)

### Responsividade
- Mobile-first
- No quiz e lacunas: layout de coluna única no mobile
- No quebra-cabeça: scrollable horizontally no mobile, dois painéis no desktop
- Ranking: tabela com scroll horizontal no mobile

---

## Arquivos de configuração necessários

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // gera arquivos estáticos para Vercel
  images: { unoptimized: true },
  // Libera o iframe do Portugol se usado
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }]
    }]
  }
}
module.exports = nextConfig
```

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs"
}
```

### `package.json` — dependências principais
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "framer-motion": "^11.0.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "xlsx": "^0.18.0",
    "lucide-react": "^0.400.0",
    "prismjs": "^1.29.0",
    "canvas-confetti": "^1.9.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## Telas adicionais e detalhes de UX

### Modal de feedback após cada exercício
```
┌────────────────────────────────┐
│  ✅ Correto!                   │
│  +100 XP                       │
│  ⭐ Bônus por 1ª tentativa!   │
│  ⚡ Resposta rápida: +25 XP   │
│                                │
│  [  Próximo exercício  ]       │
│  [  Ver explicação    ]        │
└────────────────────────────────┘
```

### Tela entre minigames
- Exibe XP acumulado até agora
- Prévia do próximo minigame
- Botão para ir ao menu ou continuar

### Tela final do quiz
- Gráfico de rosca com % de acertos
- Lista de perguntas: quais acertou (verde) e errou (vermelho)
- XP total do quiz
- Botão "Ver Ranking Geral"

---

## Instruções de deploy na Vercel

1. Crie o repositório no GitHub: `github.com/seu-usuario/portugol-games`
2. Importe o projeto na Vercel: [vercel.com/new](https://vercel.com/new)
3. Configure:
   - Framework: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `out` (se `output: 'export'`) ou padrão `.next`
4. Clique em **Deploy**
5. A URL será algo como: `portugol-games.vercel.app`

---

## Checklist de entregáveis

O agente deve entregar **tudo funcionando**, incluindo:

- [ ] Tela de login com nome + turma
- [ ] Menu com 3 minigames e indicador de progresso
- [ ] Minigame 1 (Lacunas) com 5 exercícios e executor Portugol
- [ ] Minigame 2 (Quebra-cabeça) com 4 exercícios e drag-and-drop
- [ ] Minigame 3 (Quiz) com 15 perguntas e cronômetro
- [ ] Sistema de XP com multiplicadores e bônus
- [ ] Tela de ranking com pódio animado e tabela completa
- [ ] Exportação .xlsx com 3 abas
- [ ] Importação de xlsx para mesclar rankings
- [ ] Design responsivo (mobile + desktop)
- [ ] Modo escuro como padrão com toggle
- [ ] Animações suaves em todas as transições
- [ ] Mini-interpretador Portugol funcional
- [ ] Pronto para deploy na Vercel sem backend
- [ ] README.md com instruções de instalação e deploy

---

## Observações finais para o agente

- **Comece pelo mini-interpretador Portugol** (`lib/portugol-interpreter.ts`), pois é o núcleo de tudo
- Teste cada minigame com os exercícios de exemplo antes de continuar
- Use `localStorage` com uma chave única por instalação (`portugol-games-v1`) para evitar conflitos
- O sistema de ranking funciona por **dispositivo** — oriente o professor a usar o mesmo computador ou exportar/importar xlsx para consolidar
- Crie dados de exemplo realistas: os exercícios devem ser progressivos em dificuldade
- Adicione uma página de ajuda/tutorial (`/ajuda`) explicando como cada minigame funciona
- Valide todos os inputs do usuário antes de salvar no localStorage
