import { PerfilAluno } from '@/types';
import { getRankingsOrdenados } from './storage';
import * as XLSX from 'xlsx';

export function exportarRankingXLSX(): void {
  const rankings = getRankingsOrdenados();
  const wb = XLSX.utils.book_new();

  // Aba 1: Ranking Geral
  const rankingData = rankings.map((r, i) => ({
    'Posição': i + 1,
    'Nome': r.nome,
    'Turma': r.turma,
    'XP Total': r.xpTotal,
    'Minigames Completados': [
      r.minigamesCompletados.lacunas ? 'Lacunas' : null,
      r.minigamesCompletados.puzzle ? 'Quebra-cabeça' : null,
      r.minigamesCompletados.quiz ? 'Quiz' : null,
    ].filter(Boolean).join(', ') || 'Nenhum',
  }));
  const ws1 = XLSX.utils.json_to_sheet(rankingData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Ranking Geral');

  // Aba 2: Detalhes
  const detalhes: Record<string, unknown>[] = [];
  rankings.forEach((r) => {
    const games = [
      { nome: 'Lacunas', data: r.minigamesCompletados.lacunas },
      { nome: 'Quebra-cabeça', data: r.minigamesCompletados.puzzle },
      { nome: 'Quiz', data: r.minigamesCompletados.quiz },
    ];
    games.forEach((g) => {
      detalhes.push({
        'Aluno': r.nome, 'Turma': r.turma, 'Minigame': g.nome,
        'Completado': g.data ? 'Sim' : 'Não',
        'XP Ganho': g.data?.xpGanho ?? 0,
        'Tentativas': g.data?.tentativas ?? 0,
        'Acertos': g.data?.acertos ?? 0,
        'Total Questões': g.data?.totalQuestoes ?? 0,
        'Tempo (s)': g.data?.tempoSegundos ?? 0,
        'Data': g.data?.completadoEm ? new Date(g.data.completadoEm).toLocaleDateString('pt-BR') : '-',
      });
    });
  });
  const ws2 = XLSX.utils.json_to_sheet(detalhes);
  XLSX.utils.book_append_sheet(wb, ws2, 'Detalhes');

  // Aba 3: Estatísticas
  const total = rankings.length;
  const completaramLacunas = rankings.filter(r => r.minigamesCompletados.lacunas).length;
  const completaramPuzzle = rankings.filter(r => r.minigamesCompletados.puzzle).length;
  const completaramQuiz = rankings.filter(r => r.minigamesCompletados.quiz).length;
  const xps = rankings.map(r => r.xpTotal);
  const mediaXP = total > 0 ? Math.round(xps.reduce((a, b) => a + b, 0) / total) : 0;
  const maiorXP = total > 0 ? Math.max(...xps) : 0;

  const stats = [
    { 'Métrica': 'Total de Alunos', 'Valor': total },
    { 'Métrica': 'Média de XP', 'Valor': mediaXP },
    { 'Métrica': 'Maior XP', 'Valor': maiorXP },
    { 'Métrica': '% Conclusão Lacunas', 'Valor': total > 0 ? `${Math.round(completaramLacunas/total*100)}%` : '0%' },
    { 'Métrica': '% Conclusão Quebra-cabeça', 'Valor': total > 0 ? `${Math.round(completaramPuzzle/total*100)}%` : '0%' },
    { 'Métrica': '% Conclusão Quiz', 'Valor': total > 0 ? `${Math.round(completaramQuiz/total*100)}%` : '0%' },
  ];
  const ws3 = XLSX.utils.json_to_sheet(stats);
  XLSX.utils.book_append_sheet(wb, ws3, 'Estatísticas');

  const date = new Date().toISOString().split('T')[0];
  const fileName = `ranking-portugol-games-${date}.xlsx`;
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function importarRankingXLSX(file: File): Promise<PerfilAluno[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets['Ranking Geral'];
        if (!ws) { reject(new Error('Aba "Ranking Geral" não encontrada')); return; }
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
        const perfis: PerfilAluno[] = rows.map(row => ({
          nome: row['Nome'] || '',
          turma: row['Turma'] || '',
          iniciadoEm: new Date().toISOString(),
          xpTotal: parseInt(String(row['XP Total'])) || 0,
          xpGasto: 0,
          inventario: [],
          avatarEquipado: '',
          corEquipada: '',
          tituloEquipado: '',
          minigamesCompletados: { lacunas: null, puzzle: null, quiz: null },
          badges: [],
        }));
        resolve(perfis);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
