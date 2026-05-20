// ==========================================
// Carregador de exercícios custom do Supabase
// ==========================================

import { supabase } from './supabase';
import { ExercicioLacuna, ExercicioPuzzle, Pergunta } from '@/types';

export async function carregarExerciciosCustom<T>(tipo: 'lacuna' | 'puzzle' | 'quiz'): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from('exercicios_custom')
      .select('dados')
      .eq('tipo', tipo)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map(row => row.dados as T);
  } catch (err) {
    console.error(`Erro ao carregar exercícios custom (${tipo}):`, err);
    return [];
  }
}

export async function carregarLacunasCustom(): Promise<ExercicioLacuna[]> {
  return carregarExerciciosCustom<ExercicioLacuna>('lacuna');
}

export async function carregarPuzzleCustom(): Promise<ExercicioPuzzle[]> {
  return carregarExerciciosCustom<ExercicioPuzzle>('puzzle');
}

export async function carregarQuizCustom(): Promise<Pergunta[]> {
  return carregarExerciciosCustom<Pergunta>('quiz');
}
