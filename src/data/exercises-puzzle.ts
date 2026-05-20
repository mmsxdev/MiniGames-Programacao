import { ExercicioPuzzle } from '@/types';

export const exerciciosPuzzle: ExercicioPuzzle[] = [
  {
    id: 'puz-1',
    titulo: 'Média de Notas Semestrais',
    descricao: 'Organize a lógica para calcular a média aritmética simples das duas notas bimestrais.',
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
      { id: 'b3', conteudo: 'media = n1 + n2 / 2.0', ehDistrator: true },
      { id: 'b4', conteudo: 'leia(media)', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Média: 7',
    dificuldade: 'facil',
  },
  {
    id: 'puz-2',
    titulo: 'Soma de Pontos de Fase',
    descricao: 'Consolide o total de pontos somando os ganhos das duas fases do jogo.',
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
      { id: 'b3', conteudo: 'total = p1 * p2', ehDistrator: true },
      { id: 'b4', conteudo: 'leia(total)', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Pontos: 450',
    dificuldade: 'facil',
  },
  {
    id: 'puz-3',
    titulo: 'Antecessor Inteiro',
    descricao: 'Ordene o processamento aritmético para encontrar e exibir o número anterior de um valor.',
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
      { id: 'b3', conteudo: 'ant = num + 1', ehDistrator: true },
      { id: 'b4', conteudo: 'escreva("Sucessor: ", ant, "\\n")', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Antecessor: 9',
    dificuldade: 'facil',
  },
  {
    id: 'puz-4',
    titulo: 'Cupom de Desconto Especial',
    descricao: 'Aplique um abatimento de 10% no valor se o valor da compra for superior a R$ 80.',
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
      { id: 'b2', conteudo: 'total = compra * 0.90', ehDistrator: false },
      { id: 'b3', conteudo: 'escreva("Total R$: ", total, "\\n")', ehDistrator: false },
      { id: 'b4', conteudo: 'se (compra < 80.0)', ehDistrator: true },
      { id: 'b5', conteudo: 'total = compra * 1.10', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: [],
    outputEsperado: 'Total R$: 90',
    dificuldade: 'medio',
  },
  {
    id: 'puz-5',
    titulo: 'Menu de Seleção Rápida',
    descricao: 'Construa a lógica de tratamento das escolhas de opções de bebidas usando caso.',
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
      { id: 'b4', conteudo: 'se (opcao == 1)', ehDistrator: true },
      { id: 'b5', conteudo: 'senao:', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: [],
    outputEsperado: 'Opção Água',
    dificuldade: 'medio',
  },
  {
    id: 'puz-6',
    titulo: 'Validador de Maioridade',
    descricao: 'Verifique se um usuário com base em sua idade é maior ou menor de idade no Brasil.',
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
      { id: 'b5', conteudo: 'se (idade < 18)', ehDistrator: true },
      { id: 'b6', conteudo: 'escreva("Erro\\n")', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3', SLOT_4: 'b4' },
    entradaSimulada: [],
    outputEsperado: 'Maior de idade',
    dificuldade: 'medio',
  },
  {
    id: 'puz-7',
    titulo: 'Lados de um Equilátero',
    descricao: 'Use os operadores lógicos corretos para certificar que todos os 3 lados de um triângulo são iguais.',
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
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 40 },
      { id: 'SLOT_2', tamanhoVisual: 35 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'se (a == b e b == c)', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("Triângulo Equilátero\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'se (a == b ou b == c)', ehDistrator: true },
      { id: 'b4', conteudo: 'escreva("Triângulo Isósceles\\n")', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2' },
    entradaSimulada: [],
    outputEsperado: 'Triângulo Equilátero',
    dificuldade: 'dificil',
  },
  {
    id: 'puz-8',
    titulo: 'Contagem Regressiva Simples',
    descricao: 'Construa um loop regressivo com decremento para simular o lançamento de um foguete.',
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
      { id: 'b4', conteudo: 'enquanto (cont == 0)', ehDistrator: true },
      { id: 'b5', conteudo: 'cont = cont + 1', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: [],
    outputEsperado: '3...\n2...\n1...\nDecolagem!',
    dificuldade: 'dificil',
  },
];
