// ==========================================
// Gerenciamento de Progresso — Portugol Games
// ==========================================

export type QuestionStatus = 'not-visited' | 'current' | 'answered-correct' | 'answered-wrong' | 'skipped';

export interface RespostaQuestao {
  respondida: boolean;
  pulada: boolean;
  correta: boolean | null;
  xpGanho: number;
  tentativas: number;
  valorResposta?: unknown; // Record<string,string> para lacunas, string para quiz, Record<string,string> para puzzle
}

export interface ProgressoMinigame {
  minigame: 'lacunas' | 'quiz' | 'quebra-cabeca';
  questaoAtual: number;
  totalQuestoes: number;
  respostas: Record<number, RespostaQuestao>;
  xpAcumulado: number;
  acertos: number;
  iniciadoEm: string;
  ultimaAtualizacaoEm: string;
  hintsComprados?: Record<number, string[]>;
  streak?: number;
  maxStreak?: number;
}

const PROGRESS_KEYS: Record<string, string> = {
  lacunas: 'portugol-progresso-lacunas',
  quiz: 'portugol-progresso-quiz',
  'quebra-cabeca': 'portugol-progresso-quebra-cabeca',
};

export function salvarProgresso(progresso: ProgressoMinigame): void {
  if (typeof window === 'undefined') return;
  const key = PROGRESS_KEYS[progresso.minigame];
  if (!key) return;
  progresso.ultimaAtualizacaoEm = new Date().toISOString();
  localStorage.setItem(key, JSON.stringify(progresso));
}

export function carregarProgresso(minigame: string): ProgressoMinigame | null {
  if (typeof window === 'undefined') return null;
  const key = PROGRESS_KEYS[minigame];
  if (!key) return null;
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as ProgressoMinigame;
  } catch {
    return null;
  }
}

export function limparProgresso(minigame: string): void {
  if (typeof window === 'undefined') return;
  const key = PROGRESS_KEYS[minigame];
  if (!key) return;
  localStorage.removeItem(key);
}

/**
 * Converte o Record de respostas para um array de QuestionStatus
 */
export function buildStatuses(
  total: number,
  current: number,
  respostas: Record<number, RespostaQuestao>
): QuestionStatus[] {
  const statuses: QuestionStatus[] = [];
  for (let i = 0; i < total; i++) {
    if (i === current) {
      statuses.push('current');
    } else if (respostas[i]) {
      const r = respostas[i];
      if (r.respondida && r.correta === true) statuses.push('answered-correct');
      else if (r.respondida && r.correta === false) statuses.push('answered-wrong');
      else if (r.pulada) statuses.push('skipped');
      else statuses.push('not-visited');
    } else {
      statuses.push('not-visited');
    }
  }
  return statuses;
}
