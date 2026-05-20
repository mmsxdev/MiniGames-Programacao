import { ExercicioPuzzle } from '@/types';

export const exerciciosPuzzle: ExercicioPuzzle[] = [
  {
    id: 'puz-1',
    titulo: 'Média de Notas Semestrais',
    descricao: 'Organize a lógica para calcular a média aritmética simples das duas notas bimestrais, atentando-se para a quebra de linha no final.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real n1, n2, media
		n1 = 8.0
		n2 = 6.0
		__SLOT_1__
		__SLOT_2__
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 30 },
      { id: 'SLOT_2', tamanhoVisual: 30 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'media = (n1 + n2) / 2.0', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("Média: ", media, "\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'media = n1 + n2 / 2.0', ehDistrator: true }, // Distrator de erro aritmético
      { id: 'b4', conteudo: 'leia(media)', ehDistrator: true }, // Distrator de erro lógico de entrada
      { id: 'b5', conteudo: 'escreva("Média: ", media)', ehDistrator: true }, // Distrator sem quebra de linha
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Média: 7',
    dificuldade: 'facil',
    rank: 'Bronze (Estagiário)',
    badge: '📐 Mestre da Aritmética',
    feedbackSucesso: '+150 XP — Média calculada com precedência perfeita!',
    feedbackErro: 'Cuidado com a fórmula! Lembre-se da ordem de operações e da quebra de linha.',
  },
  {
    id: 'puz-2',
    titulo: 'Soma de Pontos de Fase',
    descricao: 'Consolide o total de pontos somando de forma correta os ganhos obtidos nas duas fases do jogo.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro p1, p2, total
		p1 = 150
		p2 = 300
		__SLOT_1__
		__SLOT_2__
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 25 },
      { id: 'SLOT_2', tamanhoVisual: 30 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'total = p1 + p2', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("Pontos: ", total, "\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'total = p1 * p2', ehDistrator: true }, // Multiplica em vez de somar
      { id: 'b4', conteudo: 'escreva("Pontos: ", total)', ehDistrator: true }, // Sem quebra de linha
      { id: 'b5', conteudo: 'leia(total)', ehDistrator: true }, // Entrada indevida
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Pontos: 450',
    dificuldade: 'facil',
    rank: 'Bronze (Estagiário)',
    badge: '🪙 Acumulador de Moedas',
    feedbackSucesso: '+150 XP — Variável total processada e exibida com sucesso!',
    feedbackErro: 'Revise o cálculo matemático e confira se há quebra de linha (\\n)!',
  },
  {
    id: 'puz-3',
    titulo: 'Antecessor Inteiro',
    descricao: 'Ordene o processamento aritmético para encontrar e exibir o número anterior de um valor dado.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro num, ant
		num = 10
		__SLOT_1__
		__SLOT_2__
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 20 },
      { id: 'SLOT_2', tamanhoVisual: 30 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'ant = num - 1', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("Antecessor: ", ant, "\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'ant = num + 1', ehDistrator: true }, // Calcula sucessor
      { id: 'b4', conteudo: 'escreva("Antecessor: ", num, "\\n")', ehDistrator: true }, // Exibe número errado
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Antecessor: 9',
    dificuldade: 'facil',
    rank: 'Bronze (Estagiário)',
    badge: '🔙 Passo Atrás',
    feedbackSucesso: '+150 XP — O antecessor foi deduzido corretamente!',
    feedbackErro: 'O antecessor deve ser exatamente 1 unidade menor do que o número original!',
  },
  {
    id: 'puz-4',
    titulo: 'Cupom de Desconto Especial',
    descricao: 'Monte a condicional para dar 10% de abatimento caso o valor da compra seja maior que R$ 80.',
    xpMaximo: 180,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real compra, total
		compra = 100.0
		__SLOT_1__
		{
			__SLOT_2__
		}
		__SLOT_3__
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 25 },
      { id: 'SLOT_2', tamanhoVisual: 25 },
      { id: 'SLOT_3', tamanhoVisual: 35 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'se (compra > 80.0)', ehDistrator: false },
      { id: 'b2', conteudo: 'total = compra * 0.90', ehDistrator: false }, // Abate 10% mantendo 90%
      { id: 'b3', conteudo: 'escreva("Total R$: ", total, "\\n")', ehDistrator: false },
      { id: 'b4', conteudo: 'se (compra < 80.0)', ehDistrator: true }, // Direção condicional inversa
      { id: 'b5', conteudo: 'total = compra * 0.10', ehDistrator: true }, // Calcula apenas o desconto
      { id: 'b6', conteudo: 'total = compra - 10.0', ehDistrator: true }, // Subtração fixa
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: [],
    outputEsperado: 'Total R$: 90',
    dificuldade: 'medio',
    rank: 'Prata (Dev Júnior)',
    badge: '💸 Economista de Código',
    feedbackSucesso: '+180 XP — Excelente! Desconto condicional calculado de maneira precisa.',
    feedbackErro: 'Revise a porcentagem! Multiplicar por 0.90 calcula o total com 10% de abatimento.',
  },
  {
    id: 'puz-5',
    titulo: 'Menu de Seleção Rápida',
    descricao: 'Construa a lógica de tratamento das escolhas de opções de bebidas usando a estrutura caso.',
    xpMaximo: 180,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro opcao
		opcao = 2
		__SLOT_1__
		{
			__SLOT_2__
				escreva("Opção Suco\\n")
				pare
			__SLOT_3__
				escreva("Opção Água\\n")
				pare
		}
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 20 },
      { id: 'SLOT_2', tamanhoVisual: 10 },
      { id: 'SLOT_3', tamanhoVisual: 10 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'escolha (opcao)', ehDistrator: false },
      { id: 'b2', conteudo: 'caso 1:', ehDistrator: false },
      { id: 'b3', conteudo: 'caso 2:', ehDistrator: false },
      { id: 'b4', conteudo: 'se (opcao == 2)', ehDistrator: true }, // Inadequado para o bloco caso
      { id: 'b5', conteudo: 'caso contrario:', ehDistrator: true }, // Distrator indevido aqui
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: [],
    outputEsperado: 'Opção Água',
    dificuldade: 'medio',
    rank: 'Prata (Dev Júnior)',
    badge: '🍔 Mestre do Cardápio',
    feedbackSucesso: '+180 XP — Estrutura Escolha-Caso perfeitamente configurada!',
    feedbackErro: 'Lembre-se da correspondência dos casos: Caso 1 para o primeiro item, Caso 2 para o segundo.',
  },
  {
    id: 'puz-6',
    titulo: 'Validador de Maioridade',
    descricao: 'Verifique se um usuário é maior ou menor de idade no Brasil usando a condicional composta.',
    xpMaximo: 180,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro idade
		idade = 20
		__SLOT_1__
		{
			__SLOT_2__
		}
		__SLOT_3__
		{
			__SLOT_4__
		}
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 20 },
      { id: 'SLOT_2', tamanhoVisual: 25 },
      { id: 'SLOT_3', tamanhoVisual: 8 },
      { id: 'SLOT_4', tamanhoVisual: 25 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'se (idade >= 18)', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("Maior de idade\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'senao', ehDistrator: false },
      { id: 'b4', conteudo: 'escreva("Menor de idade\\n")', ehDistrator: false },
      { id: 'b5', conteudo: 'se (idade < 18)', ehDistrator: true }, // Duplicação inútil
      { id: 'b6', conteudo: 'escreva("Menor de idade")', ehDistrator: true }, // Falta quebra de linha
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3', SLOT_4: 'b4' },
    entradaSimulada: [],
    outputEsperado: 'Maior de idade',
    dificuldade: 'medio',
    rank: 'Prata (Dev Júnior)',
    badge: '🪪 Guarda Civil',
    feedbackSucesso: '+180 XP — Condicional composta implementada com maestria!',
    feedbackErro: 'Verifique o sinal de comparação e as saídas que precisam de quebra de linha.',
  },
  {
    id: 'puz-7',
    titulo: 'Condição de Existência de Triângulo',
    descricao: 'Valide se três medidas lineares podem compor geometricamente um triângulo utilizando operadores lógicos.',
    xpMaximo: 220,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro a, b, c
		a = 5
		b = 5
		c = 5
		__SLOT_1__
		{
			__SLOT_2__
		}
		__SLOT_3__
		{
			__SLOT_4__
		}
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 45 },
      { id: 'SLOT_2', tamanhoVisual: 35 },
      { id: 'SLOT_3', tamanhoVisual: 8 },
      { id: 'SLOT_4', tamanhoVisual: 35 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'se (a < b + c e b < a + c e c < a + b)', ehDistrator: false }, // Condição geométrica de existência real
      { id: 'b2', conteudo: 'escreva("Triângulo válido\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'senao', ehDistrator: false },
      { id: 'b4', conteudo: 'escreva("Triângulo inválido\\n")', ehDistrator: false },
      { id: 'b5', conteudo: 'se (a == b e b == c)', ehDistrator: true }, // Testa equilátero, não existência geral
      { id: 'b6', conteudo: 'se (a < b + c ou b < a + c)', ehDistrator: true }, // Operador OU incorreto para existência
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3', SLOT_4: 'b4' },
    entradaSimulada: [],
    outputEsperado: 'Triângulo válido',
    dificuldade: 'dificil',
    rank: 'Ouro (Dev Pleno)',
    badge: '📐 Geômetra do Código',
    feedbackSucesso: '+220 XP — Excelente! Condição de existência com lógica E aplicada perfeitamente.',
    feedbackErro: 'Para que um triângulo exista, todos os lados devem ser menores que a soma dos outros dois concomitantemente (E lógico)!',
  },
  {
    id: 'puz-8',
    titulo: 'Contador Regressivo Controlado',
    descricao: 'Construa um loop regressivo com decremento para simular a decolagem do foguete sem gerar loops infinitos.',
    xpMaximo: 220,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro cont
		cont = 3
		__SLOT_1__
		{
			__SLOT_2__
			__SLOT_3__
		}
		escreva("Decolagem!\\n")
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 25 },
      { id: 'SLOT_2', tamanhoVisual: 20 },
      { id: 'SLOT_3', tamanhoVisual: 20 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'enquanto (cont > 0)', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva(cont, "...\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'cont = cont - 1', ehDistrator: false },
      { id: 'b4', conteudo: 'enquanto (cont == 0)', ehDistrator: true }, // Condição que nunca entraria
      { id: 'b5', conteudo: 'cont = cont + 1', ehDistrator: true }, // Laço infinito crescente
      { id: 'b6', conteudo: 'escreva(cont)', ehDistrator: true }, // Falta pontuação e quebra
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: [],
    outputEsperado: '3...\n2...\n1...\nDecolagem!',
    dificuldade: 'dificil',
    rank: 'Ouro (Dev Pleno)',
    badge: '🚀 Engenheiro Espacial',
    feedbackSucesso: '+220 XP — Fantástico! Evitou um loop infinito e realizou a contagem decrescente com precisão.',
    feedbackErro: 'No loop regressivo, a variável de controle precisa diminuir (decrementar) a cada volta.',
  },
];
