import { Pergunta } from '@/types';

export const quizQuestions: Pergunta[] = [
  {
    id: 'q1', tipo: 'multipla_escolha', enunciado: 'Qual tipo de variável armazena números inteiros em Portugol?',
    opcoes: [
      { id: 'a', texto: 'real', correta: false, explicacao: '"real" armazena números com casas decimais.' },
      { id: 'b', texto: 'inteiro', correta: true, explicacao: '"inteiro" armazena números sem casas decimais.' },
      { id: 'c', texto: 'cadeia', correta: false, explicacao: '"cadeia" armazena texto.' },
      { id: 'd', texto: 'logico', correta: false, explicacao: '"logico" armazena verdadeiro ou falso.' },
    ],
    xpBase: 50, tempoBonusSegundos: 15, dificuldade: 'facil', categoria: 'variáveis',
  },
  {
    id: 'q2', tipo: 'verdadeiro_falso', enunciado: 'Em Portugol, o operador de atribuição é o símbolo "=".',
    opcoes: [
      { id: 'a', texto: 'Verdadeiro', correta: false, explicacao: 'O operador de atribuição em Portugol é "<-".' },
      { id: 'b', texto: 'Falso', correta: true, explicacao: 'Correto! Em Portugol usa-se "<-" para atribuir valores.' },
    ],
    xpBase: 50, tempoBonusSegundos: 10, dificuldade: 'facil', categoria: 'variáveis',
  },
  {
    id: 'q3', tipo: 'multipla_escolha', enunciado: 'Qual será a saída do código abaixo?',
    codigoIlustrativo: 'inteiro x\nx <- 10\nescreval(x + 5)',
    opcoes: [
      { id: 'a', texto: '10', correta: false },
      { id: 'b', texto: '15', correta: true, explicacao: 'x vale 10, e 10 + 5 = 15.' },
      { id: 'c', texto: '5', correta: false },
      { id: 'd', texto: 'Erro', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 20, dificuldade: 'facil', categoria: 'operadores',
  },
  {
    id: 'q4', tipo: 'multipla_escolha', enunciado: 'Qual operador retorna o resto da divisão inteira?',
    opcoes: [
      { id: 'a', texto: '/', correta: false, explicacao: '/ realiza divisão normal.' },
      { id: 'b', texto: '%', correta: true, explicacao: '% (módulo) retorna o resto da divisão.' },
      { id: 'c', texto: '^', correta: false, explicacao: '^ é potenciação.' },
      { id: 'd', texto: '*', correta: false, explicacao: '* é multiplicação.' },
    ],
    xpBase: 50, tempoBonusSegundos: 15, dificuldade: 'facil', categoria: 'operadores',
  },
  {
    id: 'q5', tipo: 'multipla_escolha', enunciado: 'Qual é a estrutura correta de um "se" em Portugol?',
    opcoes: [
      { id: 'a', texto: 'if (x > 0) { }', correta: false, explicacao: 'Essa é a sintaxe de JavaScript/C.' },
      { id: 'b', texto: 'se (x > 0) { }', correta: true, explicacao: 'Correto! "se" é a palavra-chave em Portugol.' },
      { id: 'c', texto: 'SI (x > 0) { }', correta: false },
      { id: 'd', texto: 'caso (x > 0) { }', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 15, dificuldade: 'facil', categoria: 'estruturas de controle',
  },
  {
    id: 'q6', tipo: 'multipla_escolha', enunciado: 'Qual será a saída?',
    codigoIlustrativo: 'inteiro x\nx <- 7\nse (x % 2 == 0) {\n  escreval("Par")\n} senao {\n  escreval("Ímpar")\n}',
    opcoes: [
      { id: 'a', texto: 'Par', correta: false },
      { id: 'b', texto: 'Ímpar', correta: true, explicacao: '7 % 2 = 1, que não é 0, logo é ímpar.' },
      { id: 'c', texto: '7', correta: false },
      { id: 'd', texto: 'Erro', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 20, dificuldade: 'medio', categoria: 'estruturas de controle',
  },
  {
    id: 'q7', tipo: 'multipla_escolha', enunciado: 'Quantas vezes o laço abaixo executa?',
    codigoIlustrativo: 'inteiro i\ni <- 1\nenquanto (i <= 3) {\n  escreval(i)\n  i <- i + 1\n}',
    opcoes: [
      { id: 'a', texto: '2 vezes', correta: false },
      { id: 'b', texto: '3 vezes', correta: true, explicacao: 'i vai de 1 a 3: executa com i=1, i=2 e i=3.' },
      { id: 'c', texto: '4 vezes', correta: false },
      { id: 'd', texto: 'Infinitas vezes', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 20, dificuldade: 'medio', categoria: 'repetição',
  },
  {
    id: 'q8', tipo: 'verdadeiro_falso',
    enunciado: 'A estrutura "faca...enquanto" sempre executa o bloco de código pelo menos uma vez.',
    opcoes: [
      { id: 'a', texto: 'Verdadeiro', correta: true, explicacao: 'Correto! A condição é verificada após a primeira execução.' },
      { id: 'b', texto: 'Falso', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 10, dificuldade: 'medio', categoria: 'repetição',
  },
  {
    id: 'q9', tipo: 'multipla_escolha', enunciado: 'Qual a saída do laço "para"?',
    codigoIlustrativo: 'inteiro i\npara (i de 1 ate 3 passo 1) {\n  escreva(i)\n}',
    opcoes: [
      { id: 'a', texto: '123', correta: true, explicacao: 'escreva (sem "l") não quebra linha, então imprime 1, 2 e 3 juntos.' },
      { id: 'b', texto: '1 2 3', correta: false },
      { id: 'c', texto: '1\\n2\\n3', correta: false },
      { id: 'd', texto: '321', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 20, dificuldade: 'medio', categoria: 'repetição',
  },
  {
    id: 'q10', tipo: 'multipla_escolha',
    enunciado: 'Qual o resultado da expressão: verdadeiro e falso?',
    opcoes: [
      { id: 'a', texto: 'verdadeiro', correta: false },
      { id: 'b', texto: 'falso', correta: true, explicacao: 'O operador "e" retorna verdadeiro só se ambos forem verdadeiros.' },
      { id: 'c', texto: 'Erro', correta: false },
      { id: 'd', texto: '1', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 15, dificuldade: 'medio', categoria: 'operadores',
  },
  {
    id: 'q11', tipo: 'multipla_escolha', enunciado: 'Qual comando é usado para ler dados do teclado em Portugol?',
    opcoes: [
      { id: 'a', texto: 'escreva()', correta: false },
      { id: 'b', texto: 'leia()', correta: true, explicacao: '"leia" captura a entrada do usuário.' },
      { id: 'c', texto: 'entrada()', correta: false },
      { id: 'd', texto: 'scanf()', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 10, dificuldade: 'facil', categoria: 'funções',
  },
  {
    id: 'q12', tipo: 'multipla_escolha', enunciado: 'Qual é a diferença entre "escreva" e "escreval"?',
    opcoes: [
      { id: 'a', texto: 'Não há diferença', correta: false },
      { id: 'b', texto: '"escreval" pula uma linha após escrever', correta: true, explicacao: '"escreval" adiciona uma quebra de linha ao final.' },
      { id: 'c', texto: '"escreva" aceita mais parâmetros', correta: false },
      { id: 'd', texto: '"escreval" só aceita números', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 15, dificuldade: 'facil', categoria: 'funções',
  },
  {
    id: 'q13', tipo: 'multipla_escolha', enunciado: 'Qual o valor de x após executar: x <- potencia(2, 3)?',
    opcoes: [
      { id: 'a', texto: '6', correta: false, explicacao: '6 seria 2 * 3 (multiplicação).' },
      { id: 'b', texto: '8', correta: true, explicacao: 'potencia(2, 3) = 2³ = 8.' },
      { id: 'c', texto: '5', correta: false },
      { id: 'd', texto: '9', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 20, dificuldade: 'dificil', categoria: 'funções',
  },
  {
    id: 'q14', tipo: 'multipla_escolha',
    enunciado: 'Qual boa prática é recomendada ao programar?',
    opcoes: [
      { id: 'a', texto: 'Usar nomes de variáveis de uma letra', correta: false },
      { id: 'b', texto: 'Nunca usar comentários', correta: false },
      { id: 'c', texto: 'Usar nomes descritivos para variáveis', correta: true, explicacao: 'Nomes descritivos tornam o código mais legível.' },
      { id: 'd', texto: 'Colocar todo o código em uma única linha', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 15, dificuldade: 'facil', categoria: 'boas práticas',
  },
  {
    id: 'q15', tipo: 'multipla_escolha',
    enunciado: 'Qual será a saída deste código?',
    codigoIlustrativo: 'inteiro soma, i\nsoma <- 0\npara (i de 1 ate 4 passo 1) {\n  soma <- soma + i\n}\nescreval(soma)',
    opcoes: [
      { id: 'a', texto: '4', correta: false },
      { id: 'b', texto: '10', correta: true, explicacao: 'soma = 1+2+3+4 = 10.' },
      { id: 'c', texto: '6', correta: false },
      { id: 'd', texto: '15', correta: false },
    ],
    xpBase: 50, tempoBonusSegundos: 30, dificuldade: 'dificil', categoria: 'repetição',
  },
];
