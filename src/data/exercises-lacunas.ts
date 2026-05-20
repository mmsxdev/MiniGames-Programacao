import { ExercicioLacuna } from '@/types';

export const exerciciosLacunas: ExercicioLacuna[] = [
  {
    id: 'lac-1',
    titulo: 'Boas-Vindas da Escola',
    descricao: 'Leia o nome do aluno e exiba uma mensagem de recepção no Portugol Games.',
    xpMaximo: 100,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		__LACUNA_1__ aluno
		escreva("Qual o seu nome? ")
		__LACUNA_2__(aluno)
		escreva("Olá, ", __LACUNA_3__, "! Bem-vindo ao Portugol Games.\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Tipo de variável para armazenar texto', tamanhoVisual: 6 },
      { id: 'LACUNA_2', dica: 'Comando para receber a entrada do usuário', tamanhoVisual: 4 },
      { id: 'LACUNA_3', dica: 'Nome da variável contendo o texto digitado', tamanhoVisual: 5 },
    ],
    respostasCorretas: { LACUNA_1: 'cadeia', LACUNA_2: 'leia', LACUNA_3: 'aluno' },
    entradaSimulada: ['Lucas'],
    outputEsperado: 'Qual o seu nome? Lucas\nOlá, Lucas! Bem-vindo ao Portugol Games.',
    dificuldade: 'facil',
  },
  {
    id: 'lac-2',
    titulo: 'Contador de Lanches',
    descricao: 'Calcule o total de itens consumidos na cantina somando coxinha e suco.',
    xpMaximo: 100,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		__LACUNA_1__ lanches, sucos, total
		lanches = 3
		sucos = 2
		total = lanches __LACUNA_2__ sucos
		escreva("Total de itens: ", __LACUNA_3__, "\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Tipo numérico sem casas decimais', tamanhoVisual: 7 },
      { id: 'LACUNA_2', dica: 'Operador matemático de soma', tamanhoVisual: 1 },
      { id: 'LACUNA_3', dica: 'Variável com o resultado final do cálculo', tamanhoVisual: 5 },
    ],
    respostasCorretas: { LACUNA_1: 'inteiro', LACUNA_2: '+', LACUNA_3: 'total' },
    entradaSimulada: [],
    outputEsperado: 'Total de itens: 5',
    dificuldade: 'facil',
  },
  {
    id: 'lac-3',
    titulo: 'Resto da Divisão',
    descricao: 'Descubra se um número é divisível obtendo o resto da divisão por 2.',
    xpMaximo: 100,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro numero, resto
		escreva("Número: ")
		leia(numero)
		resto = numero __LACUNA_1__ 2
		escreva("Resto encontrado: ", __LACUNA_2__, "\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Operador aritmético que calcula o resto da divisão', tamanhoVisual: 1 },
      { id: 'LACUNA_2', dica: 'Nome da variável contendo o resto', tamanhoVisual: 5 },
    ],
    respostasCorretas: { LACUNA_1: '%', LACUNA_2: 'resto' },
    entradaSimulada: ['9'],
    outputEsperado: 'Número: 9\nResto encontrado: 1',
    dificuldade: 'facil',
  },
  {
    id: 'lac-4',
    titulo: 'Aprovado ou Recuperação',
    descricao: 'Determine se a média do trimestre garante aprovação ou se o aluno fica de recuperação.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		real nota
		escreva("Nota trimestral: ")
		leia(nota)
		__LACUNA_1__ (nota __LACUNA_2__ 6.0)
		{
			escreva("Aprovado!\\n")
		}
		__LACUNA_3__
		{
			escreva("Recuperação!\\n")
		}
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Condicional se verdadeiro', tamanhoVisual: 2 },
      { id: 'LACUNA_2', dica: 'Operador comparativo maior ou igual', tamanhoVisual: 2 },
      { id: 'LACUNA_3', dica: 'Palavra-chave executada caso a condição seja falsa', tamanhoVisual: 5 },
    ],
    respostasCorretas: { LACUNA_1: 'se', LACUNA_2: '>=', LACUNA_3: 'senao' },
    entradaSimulada: ['5.5'],
    outputEsperado: 'Nota trimestral: 5.5\nRecuperação!',
    dificuldade: 'medio',
  },
  {
    id: 'lac-5',
    titulo: 'Seleção de Jogo',
    descricao: 'Estruture o menu de opções para a escolha de classes de personagem usando Escolha-Caso.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro classe
		escreva("1-Guerreiro, 2-Mago: ")
		leia(classe)
		__LACUNA_1__ (classe)
		{
			__LACUNA_2__ 1:
				escreva("Guerreiro selecionado!\\n")
				pare
			caso 2:
				escreva("Mago selecionado!\\n")
				pare
			caso __LACUNA_3__:
				escreva("Opção inválida!\\n")
		}
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Comando de decisão múltipla', tamanhoVisual: 8 },
      { id: 'LACUNA_2', dica: 'Cláusula de opção individual', tamanhoVisual: 4 },
      { id: 'LACUNA_3', dica: 'Opção padrão executada se nenhuma outra coincidir', tamanhoVisual: 9 },
    ],
    respostasCorretas: { LACUNA_1: 'escolha', LACUNA_2: 'caso', LACUNA_3: 'contrario' },
    entradaSimulada: ['3'],
    outputEsperado: '1-Guerreiro, 2-Mago: 3\nOpção inválida!',
    dificuldade: 'medio',
  },
  {
    id: 'lac-6',
    titulo: 'Desconto de Estudante',
    descricao: 'Verifique a idade do estudante para saber se ele tem direito a ingresso gratuito no evento.',
    xpMaximo: 150,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro idade
		escreva("Sua idade: ")
		leia(idade)
		se (idade __LACUNA_1__ 18)
		{
			escreva("Entrada gratuita!\\n")
		}
		__LACUNA_2__
		{
			escreva("Entrada inteira: R$ 20\\n")
		}
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Operador menor que', tamanhoVisual: 1 },
      { id: 'LACUNA_2', dica: 'Bloco alternativo senao', tamanhoVisual: 5 },
    ],
    respostasCorretas: { LACUNA_1: '<', LACUNA_2: 'senao' },
    entradaSimulada: ['17'],
    outputEsperado: 'Sua idade: 17\nEntrada gratuita!',
    dificuldade: 'medio',
  },
  {
    id: 'lac-7',
    titulo: 'Multiplicador do 5',
    descricao: 'Desenvolva um laço de repetição contador do tipo para para rodar a tabuada simples do 5.',
    xpMaximo: 200,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		inteiro cont, total
		__LACUNA_1__ (cont = 1; cont __LACUNA_2__ 10; __LACUNA_3__)
		{
			total = 5 * cont
			escreva("5 x ", cont, " = ", total, "\\n")
		}
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Comando de repetição controlada', tamanhoVisual: 4 },
      { id: 'LACUNA_2', dica: 'Operador menor ou igual', tamanhoVisual: 2 },
      { id: 'LACUNA_3', dica: 'Incremento de passo 1 da variável cont', tamanhoVisual: 6 },
    ],
    respostasCorretas: { LACUNA_1: 'para', LACUNA_2: '<=', LACUNA_3: 'cont++' },
    entradaSimulada: [],
    outputEsperado: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50',
    dificuldade: 'dificil',
  },
  {
    id: 'lac-8',
    titulo: 'Validação de Acesso',
    descricao: 'Crie um loop de segurança do tipo enquanto para solicitar a senha até que o acesso seja liberado.',
    xpMaximo: 200,
    codigoTemplate: `programa
{
	funcao inicio()
	{
		cadeia chave
		chave = ""
		__LACUNA_1__ (chave __LACUNA_2__ "ADS2")
		{
			escreva("Chave de acesso: ")
			leia(chave)
		}
		escreva("Acesso __LACUNA_3__!\\n")
	}
}`,
    lacunas: [
      { id: 'LACUNA_1', dica: 'Estrutura de repetição condicional', tamanhoVisual: 8 },
      { id: 'LACUNA_2', dica: 'Operador comparativo de diferença', tamanhoVisual: 2 },
      { id: 'LACUNA_3', dica: 'Mensagem de sucesso', tamanhoVisual: 8 },
    ],
    respostasCorretas: { LACUNA_1: 'enquanto', LACUNA_2: '!=', LACUNA_3: 'liberado' },
    entradaSimulada: ['errado', 'ADS2'],
    outputEsperado: 'Chave de acesso: errado\nChave de acesso: ADS2\nAcesso liberado!',
    dificuldade: 'dificil',
  },
];
