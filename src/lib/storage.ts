// ==========================================
// Funções de localStorage — Portugol Games
// ==========================================

import { PerfilAluno, ResultadoMinigame } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

const STORAGE_KEY = 'portugol-games-v1';
const RANKINGS_KEY = 'portugol-games-rankings-v1';

// --- Perfil do Aluno ---

export function salvarPerfil(perfil: PerfilAluno): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfil));
  // Também salva no ranking
  adicionarAoRanking(perfil);

  if (perfil.id) {
    supabase.from('perfis').upsert({
      id: perfil.id,
      nome: perfil.nome,
      turma: perfil.turma,
      xp_total: perfil.xpTotal,
      xp_gasto: perfil.xpGasto,
      inventario: perfil.inventario,
      avatar_equipado: perfil.avatarEquipado,
      cor_equipada: perfil.corEquipada,
      titulo_equipado: perfil.tituloEquipado,
      updated_at: new Date().toISOString()
    }).then(({ error }) => {
      if (error) console.error('Supabase sync error:', error);
    });
  }
}

export function getPerfil(): PerfilAluno | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    const p = JSON.parse(data) as PerfilAluno;
    let modified = false;
    
    if (!p.id) { p.id = uuidv4(); modified = true; }
    if (p.xpGasto === undefined) { p.xpGasto = 0; modified = true; }
    if (!p.inventario) { p.inventario = []; modified = true; }
    if (p.avatarEquipado === undefined) { p.avatarEquipado = ''; modified = true; }
    if (p.corEquipada === undefined) { p.corEquipada = ''; modified = true; }
    if (p.tituloEquipado === undefined) { p.tituloEquipado = ''; modified = true; }
    
    if (modified) salvarPerfil(p);
    
    return p;
  } catch {
    return null;
  }
}

export function criarPerfil(nome: string, turma: string): PerfilAluno {
  const perfil: PerfilAluno = {
    id: uuidv4(),
    nome: nome.trim(),
    turma: turma.trim(),
    iniciadoEm: new Date().toISOString(),
    xpTotal: 0,
    xpGasto: 0,
    inventario: [],
    avatarEquipado: '',
    corEquipada: '',
    tituloEquipado: '',
    minigamesCompletados: {
      lacunas: null,
      puzzle: null,
      quiz: null,
    },
    badges: [],
  };
  salvarPerfil(perfil);
  return perfil;
}

export async function buscarPerfilSupabase(nome: string, turma: string): Promise<PerfilAluno | null> {
  try {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('nome', nome.trim())
      .eq('turma', turma.trim())
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      nome: data.nome,
      turma: data.turma,
      iniciadoEm: data.updated_at || new Date().toISOString(),
      xpTotal: data.xp_total || 0,
      xpGasto: data.xp_gasto || 0,
      inventario: data.inventario || [],
      avatarEquipado: data.avatar_equipado || '',
      corEquipada: data.cor_equipada || '',
      tituloEquipado: data.titulo_equipado || '',
      minigamesCompletados: {
        lacunas: null,
        puzzle: null,
        quiz: null,
      },
      badges: [],
    };
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    return null;
  }
}

export function salvarResultado(
  minigame: 'lacunas' | 'puzzle' | 'quiz',
  resultado: ResultadoMinigame
): PerfilAluno | null {
  const perfil = getPerfil();
  if (!perfil) return null;

  perfil.minigamesCompletados[minigame] = resultado;
  perfil.xpTotal = calcularXPTotal(perfil);
  salvarPerfil(perfil);
  return perfil;
}

function calcularXPTotal(perfil: PerfilAluno): number {
  let total = 0;
  const { lacunas, puzzle, quiz } = perfil.minigamesCompletados;
  if (lacunas) total += lacunas.xpGanho;
  if (puzzle) total += puzzle.xpGanho;
  if (quiz) total += quiz.xpGanho;
  return total;
}

// --- Rankings ---

export function adicionarAoRanking(perfil: PerfilAluno): void {
  if (typeof window === 'undefined') return;
  const rankings = getRankings();
  const existingIndex = rankings.findIndex(
    (r) => r.nome === perfil.nome && r.turma === perfil.turma
  );
  if (existingIndex >= 0) {
    rankings[existingIndex] = perfil;
  } else {
    rankings.push(perfil);
  }
  localStorage.setItem(RANKINGS_KEY, JSON.stringify(rankings));
}

export function getRankings(): PerfilAluno[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(RANKINGS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as PerfilAluno[];
  } catch {
    return [];
  }
}

export function importarRankings(novos: PerfilAluno[]): void {
  const rankings = getRankings();
  for (const novo of novos) {
    const existingIndex = rankings.findIndex(
      (r) => r.nome === novo.nome && r.turma === novo.turma
    );
    if (existingIndex >= 0) {
      // Keep the one with higher XP
      if (novo.xpTotal > rankings[existingIndex].xpTotal) {
        rankings[existingIndex] = novo;
      }
    } else {
      rankings.push(novo);
    }
  }
  localStorage.setItem(RANKINGS_KEY, JSON.stringify(rankings));
}

export function getRankingsOrdenados(): PerfilAluno[] {
  return getRankings().sort((a, b) => b.xpTotal - a.xpTotal);
}

// --- Badges ---

export function adicionarBadge(badge: string): void {
  const perfil = getPerfil();
  if (!perfil) return;
  if (!perfil.badges.includes(badge)) {
    perfil.badges.push(badge);
    salvarPerfil(perfil);
  }
}

// --- Validação ---

export function validarNome(nome: string): boolean {
  return nome.trim().length >= 3;
}

export function validarTurma(turma: string): boolean {
  return turma.trim().length >= 1;
}

// --- Limpar dados ---

export function limparPerfil(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// --- Loja e Dicas ---

export function comprarDicaLocal(custo: number): boolean {
  const perfil = getPerfil();
  if (!perfil) return false;
  
  const xpAtual = perfil.xpTotal - perfil.xpGasto;
  if (xpAtual >= custo) {
    perfil.xpGasto += custo;
    salvarPerfil(perfil);
    return true;
  }
  return false;
}

export function comprarItemLoja(id: string, custo: number, tipo: 'avatar' | 'cor' | 'titulo'): boolean {
  const perfil = getPerfil();
  if (!perfil) return false;
  
  if (perfil.inventario.includes(id)) return false;
  
  const xpAtual = perfil.xpTotal - perfil.xpGasto;
  if (xpAtual >= custo) {
    perfil.xpGasto += custo;
    perfil.inventario.push(id);
    if (tipo === 'avatar') perfil.avatarEquipado = id;
    if (tipo === 'cor') perfil.corEquipada = id;
    if (tipo === 'titulo') perfil.tituloEquipado = id;
    salvarPerfil(perfil);
    return true;
  }
  return false;
}

export function equiparItem(id: string, tipo: 'avatar' | 'cor' | 'titulo'): void {
  const perfil = getPerfil();
  if (!perfil) return;
  if (perfil.inventario.includes(id)) {
    if (tipo === 'avatar') perfil.avatarEquipado = id;
    if (tipo === 'cor') perfil.corEquipada = id;
    if (tipo === 'titulo') perfil.tituloEquipado = id;
    salvarPerfil(perfil);
  }
}
