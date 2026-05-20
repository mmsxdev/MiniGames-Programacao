import { ExercicioLacuna } from '@/types';

export const exerciciosLacunas: ExercicioLacuna[] = [
  {
    id: 'lac-1',
    titulo: 'Saudação Personalizada',
    descricao: 'Leia um apelido e exiba uma mensagem de boas-vindas.',
    xpMaximo: 100,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		__LACUNA_1__ apelido

		escreva("Digite seu apelido: ")
		__LACUNA_2__(apelido)

		escreva("Bem-vindo, ", __LACUNA_3__, "!\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Tipo de variável para texto', tamanhoVisual: 6 },
      { id: 'LACUNA_2', dica: 'Comando para ler a entrada do teclado', tamanhoVisual: 4 },
      { id: 'LACUNA_3', dica: 'Nome da variável', tamanhoVisual: 7 },
    ],
    respostasCorretas: { LACUNA_1: 'cadeia', LACUNA_2: 'leia', LACUNA_3: 'apelido' },
    entradaSimulada: ['Miguel'],
    outputEsperado: 'Digite seu apelido: Miguel\nBem-vindo, Miguel!',
    dificuldade: 'facil',
  },
  {
    id: 'lac-2',
    titulo: 'Cadastro de Vendedor',
    descricao: 'Leia o nome e total de vendas, exibindo o resultado formatado.',
    xpMaximo: 120,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		cadeia nome
		__LACUNA_1__ vendas

		escreva("Nome do vendedor: ")
		leia(nome)

		escreva("Total vendido: ")
		__LACUNA_2__(vendas)

		escreva("O vendedor ", nome, " vendeu R$", __LACUNA_3__, "\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Tipo numérico com casas decimais', tamanhoVisual: 4 },
      { id: 'LACUNA_2', dica: 'Comando para ler a variável', tamanhoVisual: 4 },
      { id: 'LACUNA_3', dica: 'Variável de total vendido', tamanhoVisual: 6 },
    ],
    respostasCorretas: { LACUNA_1: 'real', LACUNA_2: 'leia', LACUNA_3: 'vendas' },
    entradaSimulada: ['João', '1500.5'],
    outputEsperado: 'Nome do vendedor: João\nTotal vendido: 1500.5\nO vendedor João vendeu R$1500.5',
    dificuldade: 'facil',
  },
  {
    id: 'lac-3',
    titulo: 'Triplo e Metade',
    descricao: 'Calcule e exiba o triplo e a metade de um valor lido.',
    xpMaximo: 120,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real valor, triplo, metade

		escreva("Digite um valor: ")
		leia(valor)

		triplo = valor __LACUNA_1__ 3
		metade = valor __LACUNA_2__ 2

		escreva("Triplo: ", __LACUNA_3__, "\\n")
		escreva("Metade: ", metade, "\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Operador de multiplicação', tamanhoVisual: 1 },
      { id: 'LACUNA_2', dica: 'Operador de divisão', tamanhoVisual: 1 },
      { id: 'LACUNA_3', dica: 'Variável com resultado do triplo', tamanhoVisual: 6 },
    ],
    respostasCorretas: { LACUNA_1: '*', LACUNA_2: '/', LACUNA_3: 'triplo' },
    entradaSimulada: ['10'],
    outputEsperado: 'Digite um valor: 10\nTriplo: 30\nMetade: 5',
    dificuldade: 'facil',
  },
  {
    id: 'lac-4',
    titulo: 'Área do Terreno',
    descricao: 'Calcule a área de um terreno usando largura e comprimento.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real largura, comprimento, area

		escreva("Digite a largura: ")
		leia(largura)

		escreva("Digite o comprimento: ")
		leia(__LACUNA_1__)

		__LACUNA_2__ = largura * comprimento

		escreva("A área é ", __LACUNA_3__, "m²\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Variável de comprimento', tamanhoVisual: 11 },
      { id: 'LACUNA_2', dica: 'Variável para guardar a área', tamanhoVisual: 4 },
      { id: 'LACUNA_3', dica: 'Exibir a variável calculada', tamanhoVisual: 4 },
    ],
    respostasCorretas: { LACUNA_1: 'comprimento', LACUNA_2: 'area', LACUNA_3: 'area' },
    entradaSimulada: ['5', '10'],
    outputEsperado: 'Digite a largura: 5\nDigite o comprimento: 10\nA área é 50m²',
    dificuldade: 'medio',
  },
  {
    id: 'lac-5',
    titulo: 'Reajuste Salarial',
    descricao: 'Calcule o novo salário com 12% de aumento.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real salario, aumento, novoSalario

		escreva("Digite o salário: ")
		leia(salario)

		aumento = salario __LACUNA_1__ 0.12
		__LACUNA_2__ = salario + aumento

		escreva("Novo salário: R$", __LACUNA_3__, "\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Operador para calcular porcentagem', tamanhoVisual: 1 },
      { id: 'LACUNA_2', dica: 'Variável que recebe o total', tamanhoVisual: 11 },
      { id: 'LACUNA_3', dica: 'Variável a ser exibida', tamanhoVisual: 11 },
    ],
    respostasCorretas: { LACUNA_1: '*', LACUNA_2: 'novoSalario', LACUNA_3: 'novoSalario' },
    entradaSimulada: ['1000'],
    outputEsperado: 'Digite o salário: 1000\nNovo salário: R$1120',
    dificuldade: 'medio',
  },
  {
    id: 'lac-6',
    titulo: 'Multa por Velocidade',
    descricao: 'Determine se o carro foi multado por ultrapassar 80Km/h.',
    xpMaximo: 200,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real velocidade, multa

		escreva("Digite a velocidade: ")
		leia(velocidade)

		__LACUNA_1__ (velocidade __LACUNA_2__ 80)
		{
			multa = (velocidade - 80) * 5
			escreva("Multado! Valor: R$", multa, "\\n")
		}
		__LACUNA_3__
		{
			escreva("Dentro do limite.\\n")
		}
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Palavra-chave para condição', tamanhoVisual: 2 },
      { id: 'LACUNA_2', dica: 'Operador maior que', tamanhoVisual: 1 },
      { id: 'LACUNA_3', dica: 'Caso contrário', tamanhoVisual: 5 },
    ],
    respostasCorretas: { LACUNA_1: 'se', LACUNA_2: '>', LACUNA_3: 'senao' },
    entradaSimulada: ['90'],
    outputEsperado: 'Digite a velocidade: 90\nMultado! Valor: R$50',
    dificuldade: 'dificil',
  },
];
