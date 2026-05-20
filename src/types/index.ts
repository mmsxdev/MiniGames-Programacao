// ==========================================
// Tipos TypeScript Globais — Portugol Games
// ==========================================

// --- Perfil e Resultados ---

export interface PerfilAluno {
  id?: string;
  nome: string;
  turma: string;
  iniciadoEm: string; // ISO timestamp
  xpTotal: number;
  xpGasto: number;
  inventario: string[];
  avatarEquipado: string;
  corEquipada: string;
  tituloEquipado: string;
  minigamesCompletados: {
    lacunas: ResultadoMinigame | null;
    puzzle: ResultadoMinigame | null;
    quiz: ResultadoMinigame | null;
  };
  badges: string[];
}

export interface ResultadoMinigame {
  completadoEm: string;
  xpGanho: number;
  tentativas: number;
  acertos: number;
  totalQuestoes: number;
  tempoSegundos: number;
}

// --- Minigame 1: Lacunas ---

export interface Lacuna {
  id: string;
  dica: string;
  tamanhoVisual: number;
}

export interface ExercicioLacuna {
  id: string;
  titulo: string;
  descricao: string;
  xpMaximo: number;
  codigoTemplate: string;
  lacunas: Lacuna[];
  respostasCorretas: Record<string, string>;
  entradaSimulada: string[];
  outputEsperado: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  rank?: string;
  badge?: string;
  feedbackSucesso?: string;
  feedbackErro?: string;
}

// --- Minigame 2: Quebra-Cabeça ---

export interface Slot {
  id: string;
  tamanhoVisual: number;
}

export interface Bloco {
  id: string;
  conteudo: string;
  ehDistrator: boolean;
}

export interface ExercicioPuzzle {
  id: string;
  titulo: string;
  descricao: string;
  xpMaximo: number;
  codigoTemplate: string;
  slots: Slot[];
  blocos: Bloco[];
  respostasCorretas: Record<string, string>;
  entradaSimulada: string[];
  outputEsperado: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  rank?: string;
  badge?: string;
  feedbackSucesso?: string;
  feedbackErro?: string;
}

// --- Minigame 3: Quiz ---

export interface OpcaoQuiz {
  id: string;
  texto: string;
  correta: boolean;
  explicacao?: string;
}

export interface Pergunta {
  id: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso';
  enunciado: string;
  codigoIlustrativo?: string;
  opcoes: OpcaoQuiz[];
  xpBase: number;
  tempoBonusSegundos?: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  categoria: string;
  rank?: string;
  badge?: string;
  feedbackSucesso?: string;
  feedbackErro?: string;
}

// --- Interpretador Portugol ---

export interface ResultadoExecucao {
  sucesso: boolean;
  saida: string[];
  erro?: {
    mensagem: string;
    linha: number;
  };
  entradaConsumida: string[];
}

// --- Theme ---

export type Theme = 'dark' | 'light';
