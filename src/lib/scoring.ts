// ==========================================
// Sistema de Pontuação e XP — Portugol Games
// ==========================================

// XP base por minigame
export const XP_BASE = {
  lacunas: 100,
  puzzle: 150,
  quiz: 50, // por pergunta
} as const;

// Multiplicadores por tentativa
export const MULTIPLICADORES = {
  primeiraVez: 1.0,
  segundaTentativa: 0.7,
  terceiraTentativa: 0.5,
  aposIsso: 0.25,
} as const;

// Bônus
export const BONUS = {
  semErros: 50,
  rapido: 25,
  streakCorreta: 10,
} as const;

/**
 * Calcula o multiplicador de XP baseado no número de tentativas
 */
export function calcularMultiplicador(tentativas: number): number {
  switch (tentativas) {
    case 1:
      return MULTIPLICADORES.primeiraVez;
    case 2:
      return MULTIPLICADORES.segundaTentativa;
    case 3:
      return MULTIPLICADORES.terceiraTentativa;
    default:
      return MULTIPLICADORES.aposIsso;
  }
}

/**
 * Calcula XP ganho em um exercício de lacunas ou puzzle
 */
export function calcularXPExercicio(
  xpMaximo: number,
  tentativas: number,
  semErros: boolean,
  tempoRapido: boolean
): number {
  let xp = Math.round(xpMaximo * calcularMultiplicador(tentativas));

  if (semErros && tentativas === 1) {
    xp += BONUS.semErros;
  }

  if (tempoRapido) {
    xp += BONUS.rapido;
  }

  return xp;
}

/**
 * Calcula XP ganho no quiz
 */
export function calcularXPQuiz(
  acertos: number,
  totalPerguntas: number,
  streakMaxima: number,
  respostasRapidas: number
): number {
  let xp = acertos * XP_BASE.quiz;

  // Bônus por streak
  xp += streakMaxima * BONUS.streakCorreta;

  // Bônus por respostas rápidas
  xp += respostasRapidas * BONUS.rapido;

  // Bônus por 100% de acerto
  if (acertos === totalPerguntas) {
    xp += BONUS.semErros;
  }

  return xp;
}

/**
 * Calcula XP total de todos os exercícios de um minigame de lacunas/puzzle
 */
export function calcularXPMinigame(
  exerciciosXP: number[]
): number {
  return exerciciosXP.reduce((sum, xp) => sum + xp, 0);
}

/**
 * Badges disponíveis
 */
export const BADGES = {
  PRIMEIRO_ACERTO: { id: 'primeiro-acerto', nome: 'Primeiro Acerto', descricao: 'Completou um exercício pela primeira vez', emoji: '🎯' },
  SEM_ERROS: { id: 'sem-erros', nome: 'Perfeição', descricao: 'Completou um minigame sem erros', emoji: '⭐' },
  VELOCISTA: { id: 'velocista', nome: 'Velocista', descricao: 'Respondeu rápido o suficiente para bônus de tempo', emoji: '⚡' },
  COMPLETO: { id: 'completo', nome: 'Completou Tudo', descricao: 'Completou todos os 3 minigames', emoji: '🏆' },
  QUIZ_MASTER: { id: 'quiz-master', nome: 'Mestre do Quiz', descricao: 'Acertou todas as perguntas do quiz', emoji: '🧠' },
  STREAK_5: { id: 'streak-5', nome: 'Em Chamas', descricao: 'Acertou 5 perguntas consecutivas', emoji: '🔥' },
} as const;
