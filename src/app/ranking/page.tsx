'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Upload, Search, Trophy, Loader2 } from 'lucide-react';
import { getRankingsOrdenados, importarRankings } from '@/lib/storage';
import { exportarRankingXLSX, importarRankingXLSX } from '@/lib/export';
import { PerfilAluno } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import confetti from 'canvas-confetti';
import { itensLoja } from '@/data/loja';
import { supabase } from '@/lib/supabase';

export default function RankingPage() {
  const router = useRouter();
  const [rankings, setRankings] = useState<PerfilAluno[]>([]);
  const [search, setSearch] = useState('');
  const [exportando, setExportando] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const confettiFired = useRef(false);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const { data, error } = await supabase
          .from('perfis')
          .select('*')
          .order('xp_total', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const remoteRankings = data.map(r => ({
            id: r.id,
            nome: r.nome,
            turma: r.turma,
            xpTotal: r.xp_total,
            xpGasto: r.xp_gasto,
            inventario: r.inventario || [],
            avatarEquipado: r.avatar_equipado || '',
            corEquipada: r.cor_equipada || '',
            tituloEquipado: r.titulo_equipado || '',
            iniciadoEm: r.updated_at,
            minigamesCompletados: { lacunas: null, puzzle: null, quiz: null },
            badges: []
          })) as PerfilAluno[];
          setRankings(remoteRankings);
        } else {
          setRankings(getRankingsOrdenados());
        }
      } catch (err) {
        console.error('Erro ao buscar do Supabase, usando local', err);
        setRankings(getRankingsOrdenados());
      }
    };
    fetchRankings();
  }, []);

  useEffect(() => {
    if (rankings.length > 0 && !confettiFired.current) {
      confettiFired.current = true;
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#7C3AED', '#3B82F6'] });
      }, 800);
    }
  }, [rankings]);

  const filtered = rankings.filter(r =>
    r.nome.toLowerCase().includes(search.toLowerCase()) ||
    r.turma.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const trueHeights = [180, 140, 110];
  const trueMedals = ['🥇', '🥈', '🥉'];
  const trueColors = ['var(--gold)', 'var(--silver)', 'var(--bronze)'];

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const novos = await importarRankingXLSX(file);
      importarRankings(novos);
      setRankings(getRankingsOrdenados());
      alert(`${novos.length} registros importados com sucesso!`);
    } catch { alert('Erro ao importar arquivo.'); }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <button className="btn btn-secondary btn-sm" onClick={() => router.push('/menu')}><ArrowLeft size={16} /> Menu</button>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => exportarRankingXLSX(setExportando)} disabled={exportando}>
            {exportando ? <><Loader2 size={16} className="animate-spin" /> Preparando...</> : <><Download size={16} /> Exportar .xlsx</>}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}><Upload size={16} /> Importar</button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-8">
        <h1 className="text-3xl font-black mb-6 text-center flex items-center justify-center gap-2"><Trophy size={32} style={{ color: 'var(--gold)' }} /> Ranking</h1>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-4 mb-8" style={{ minHeight: 240 }}>
            {podiumOrder.map((p, i) => {
              if (!p) return null;
              const actualIndex = top3.indexOf(p);
              const color = trueColors[actualIndex];
              const medal = trueMedals[actualIndex];
              const height = trueHeights[actualIndex];
              
              const customAvatar = p.avatarEquipado ? itensLoja.find(i => i.id === p.avatarEquipado)?.valor : null;
              const customCor = p.corEquipada ? itensLoja.find(i => i.id === p.corEquipada)?.valor : null;
              const borderCor = customCor || color;
              
              return (
                <motion.div key={p.nome} className="podium-bar text-center" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto bg-cover bg-center overflow-hidden" style={{ background: customCor || `${color}30`, border: `3px solid ${borderCor}` }}>
                    {customAvatar ? <span className="text-3xl leading-none">{customAvatar}</span> : <span className="text-xl font-bold" style={{ color: color }}>{getInitials(p.nome)}</span>}
                  </div>
                  <div className="text-sm font-bold truncate max-w-24">
                    <span style={customCor === 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)' ? { backgroundImage: customCor, WebkitBackgroundClip: 'text', color: 'transparent' } : { color: customCor || 'inherit' }}>
                      {p.nome.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{p.turma}</div>
                  <div className="text-2xl mb-1">{medal}</div>
                  <motion.div className="rounded-t-xl flex items-end justify-center pb-2" style={{ width: 90, height: height, background: `linear-gradient(180deg, ${color}40, ${color}15)`, border: `1px solid ${color}40` }} initial={{ height: 0 }} animate={{ height: height }} transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}>
                    <span className="font-bold text-lg" style={{ color: color }}>{p.xpTotal} XP</span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        {rankings.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <Trophy size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nenhum resultado ainda.</p>
            <p className="text-sm">Complete os minigames para aparecer no ranking!</p>
          </div>
        )}

        {rankings.length > 0 && (
          <>
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 40 }} placeholder="Buscar por nome ou turma..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="overflow-x-auto">
              <table className="ranking-table">
                <thead><tr>
                  <th>#</th><th>Nome</th><th>Turma</th><th>Lacunas</th><th>Quebra-cabeça</th><th>Quiz</th><th>XP Total</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const customAvatar = r.avatarEquipado ? itensLoja.find(it => it.id === r.avatarEquipado)?.valor : null;
                    const customCor = r.corEquipada ? itensLoja.find(it => it.id === r.corEquipada)?.valor : null;
                    const isRainbow = customCor === 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)';

                    return (
                      <tr key={`${r.nome}-${r.turma}`} className={i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}>
                        <td className="font-bold">{i <= 2 ? ['🥇','🥈','🥉'][i] : i + 1}</td>
                        <td className="font-medium">
                          {customAvatar && <span className="mr-2 text-xl align-middle leading-none">{customAvatar}</span>}
                          <span style={isRainbow ? { backgroundImage: customCor, WebkitBackgroundClip: 'text', color: 'transparent' } : { color: customCor || 'inherit' }}>
                            {r.nome}
                          </span>
                        </td>
                        <td>{r.turma}</td>
                        <td>{r.minigamesCompletados.lacunas ? `${r.minigamesCompletados.lacunas.xpGanho} XP` : '—'}</td>
                      <td>{r.minigamesCompletados.puzzle ? `${r.minigamesCompletados.puzzle.xpGanho} XP` : '—'}</td>
                      <td>{r.minigamesCompletados.quiz ? `${r.minigamesCompletados.quiz.xpGanho} XP` : '—'}</td>
                      <td className="font-bold" style={{ color: 'var(--primary-light)' }}>{r.xpTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
