import { ExercicioPuzzle } from '@/types';

export const exerciciosPuzzle: ExercicioPuzzle[] = [
  {
    id: 'puz-1',
    titulo: 'Multiplicação de Números',
    descricao: 'Monte o código para ler dois números e exibir o resultado da multiplicação.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro n1, n2, resultado
		escreva("Número 1: ")
		__SLOT_1__
		escreva("Número 2: ")
		__SLOT_2__
		__SLOT_3__
		escreva("Resultado: ", resultado, "\\n")
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 10 },
      { id: 'SLOT_2', tamanhoVisual: 10 },
      { id: 'SLOT_3', tamanhoVisual: 20 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'leia(n1)', ehDistrator: false },
      { id: 'b2', conteudo: 'leia(n2)', ehDistrator: false },
      { id: 'b3', conteudo: 'resultado = n1 * n2', ehDistrator: false },
      { id: 'b4', conteudo: 'resultado = n1 + n2', ehDistrator: true },
      { id: 'b5', conteudo: 'escreva(n1)', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: ['5', '4'],
    outputEsperado: 'Número 1: 5\nNúmero 2: 4\nResultado: 20',
    dificuldade: 'facil',
  },
  {
    id: 'puz-2',
    titulo: 'Antecessor e Sucessor',
    descricao: 'Leia um número e exiba o seu número anterior e o seu próximo número.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		__SLOT_1__
		escreva("Digite um número: ")
		leia(numero)
		__SLOT_2__
		__SLOT_3__
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 15 },
      { id: 'SLOT_2', tamanhoVisual: 35 },
      { id: 'SLOT_3', tamanhoVisual: 35 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'inteiro numero', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("Anterior: ", numero - 1, "\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'escreva("Próximo: ", numero + 1, "\\n")', ehDistrator: false },
      { id: 'b4', conteudo: 'cadeia numero', ehDistrator: true },
      { id: 'b5', conteudo: 'escreva("Anterior: ", numero + 1, "\\n")', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: ['10'],
    outputEsperado: 'Digite um número: 10\nAnterior: 9\nPróximo: 11',
    dificuldade: 'facil',
  },
  {
    id: 'puz-3',
    titulo: 'Área do Triângulo',
    descricao: 'Organize os blocos para calcular a área de um triângulo.',
    xpMaximo: 180,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		__SLOT_1__
		escreva("Base e Altura:\\n")
		__SLOT_2__
		__SLOT_3__
		__SLOT_4__
		escreva("Área: ", area, "\\n")
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 25 },
      { id: 'SLOT_2', tamanhoVisual: 12 },
      { id: 'SLOT_3', tamanhoVisual: 12 },
      { id: 'SLOT_4', tamanhoVisual: 28 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'real base, altura, area', ehDistrator: false },
      { id: 'b2', conteudo: 'leia(base)', ehDistrator: false },
      { id: 'b3', conteudo: 'leia(altura)', ehDistrator: false },
      { id: 'b4', conteudo: 'area = (base * altura) / 2', ehDistrator: false },
      { id: 'b5', conteudo: 'area = base * altura', ehDistrator: true },
      { id: 'b6', conteudo: 'inteiro area', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3', SLOT_4: 'b4' },
    entradaSimulada: ['10', '5'],
    outputEsperado: 'Base e Altura:\n10\n5\nÁrea: 25',
    dificuldade: 'medio',
  },
  {
    id: 'puz-4',
    titulo: 'Desconto de 10%',
    descricao: 'Monte o código que aplica um desconto de 10% no valor lido.',
    xpMaximo: 180,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real valor, desconto, total
		escreva("Valor: ")
		leia(valor)
		__SLOT_1__
		__SLOT_2__
		__SLOT_3__
	}
}`,
    slots: [
      { id: 'SLOT_1', tamanhoVisual: 25 },
      { id: 'SLOT_2', tamanhoVisual: 25 },
      { id: 'SLOT_3', tamanhoVisual: 30 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'desconto = valor * 0.10', ehDistrator: false },
      { id: 'b2', conteudo: 'total = valor - desconto', ehDistrator: false },
      { id: 'b3', conteudo: 'escreva("Total: R$", total, "\\n")', ehDistrator: false },
      { id: 'b4', conteudo: 'total = valor + desconto', ehDistrator: true },
      { id: 'b5', conteudo: 'desconto = valor / 10', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3' },
    entradaSimulada: ['200'],
    outputEsperado: 'Valor: 200\nTotal: R$180',
    dificuldade: 'medio',
  },
  {
    id: 'puz-5',
    titulo: 'Par ou Ímpar',
    descricao: 'Verifique se um número é par ou ímpar usando a estrutura SE.',
    xpMaximo: 220,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro numero
		escreva("Número: ")
		leia(numero)
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
      { id: 'SLOT_2', tamanhoVisual: 20 },
      { id: 'SLOT_3', tamanhoVisual: 8 },
      { id: 'SLOT_4', tamanhoVisual: 20 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'se (numero % 2 == 0)', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("É PAR\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'senao', ehDistrator: false },
      { id: 'b4', conteudo: 'escreva("É ÍMPAR\\n")', ehDistrator: false },
      { id: 'b5', conteudo: 'se (numero % 2 != 0)', ehDistrator: true },
      { id: 'b6', conteudo: 'escreva("É ZERO\\n")', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3', SLOT_4: 'b4' },
    entradaSimulada: ['4'],
    outputEsperado: 'Número: 4\nÉ PAR',
    dificuldade: 'dificil',
  },
  {
    id: 'puz-6',
    titulo: 'Ano Bissexto',
    descricao: 'Verifique se o ano lido é bissexto ou não.',
    xpMaximo: 250,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro ano
		escreva("Ano: ")
		leia(ano)
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
      { id: 'SLOT_1', tamanhoVisual: 60 },
      { id: 'SLOT_2', tamanhoVisual: 25 },
      { id: 'SLOT_3', tamanhoVisual: 8 },
      { id: 'SLOT_4', tamanhoVisual: 30 },
    ],
    blocos: [
      { id: 'b1', conteudo: 'se ((ano % 4 == 0 e ano % 100 != 0) ou (ano % 400 == 0))', ehDistrator: false },
      { id: 'b2', conteudo: 'escreva("É bissexto.\\n")', ehDistrator: false },
      { id: 'b3', conteudo: 'senao', ehDistrator: false },
      { id: 'b4', conteudo: 'escreva("Não é bissexto.\\n")', ehDistrator: false },
      { id: 'b5', conteudo: 'se (ano % 4 == 0)', ehDistrator: true },
      { id: 'b6', conteudo: 'escreva("Fim.\\n")', ehDistrator: true },
    ],
    respostasCorretas: { SLOT_1: 'b1', SLOT_2: 'b2', SLOT_3: 'b3', SLOT_4: 'b4' },
    entradaSimulada: ['2024'],
    outputEsperado: 'Ano: 2024\nÉ bissexto.',
    dificuldade: 'dificil',
  },
];
