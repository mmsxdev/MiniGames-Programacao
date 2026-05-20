'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code, Puzzle, HelpCircle, Trophy, LogOut, Sparkles, CheckCircle2, Store, GraduationCap } from 'lucide-react';
import { getPerfil, limparPerfil } from '@/lib/storage';
import { PerfilAluno } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScoreBar } from '@/components/game/ScoreBar';
import { itensLoja } from '@/data/loja';

const games = [
  { key: 'lacunas' as const, title: 'Código com Lacunas', desc: 'Preencha as lacunas no código Portugol e execute para verificar.', icon: <Code size={32} />, xpMax: 500, href: '/game/lacunas', color: '#7C3AED' },
  { key: 'puzzle' as const, title: 'Quebra-Cabeça de Código', desc: 'Arraste blocos de código para os locais corretos e monte o programa.', icon: <Puzzle size={32} />, xpMax: 600, href: '/game/quebra-cabeca', color: '#3B82F6' },
  { key: 'quiz' as const, title: 'Quiz de Programação', desc: 'Responda perguntas sobre Portugol e lógica de programação.', icon: <HelpCircle size={32} />, xpMax: 750, href: '/game/quiz', color: '#10B981' },
];

export default function MenuPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilAluno | null>(null);

  useEffect(() => {
    const p = getPerfil();
    if (!p) { router.push('/'); return; }
    setPerfil(p);
  }, [router]);

  if (!perfil) return null;

  const completados = [
    perfil.minigamesCompletados.lacunas,
    perfil.minigamesCompletados.puzzle,
    perfil.minigamesCompletados.quiz,
  ].filter(Boolean).length;

  const avatar = itensLoja.find(i => i.id === perfil.avatarEquipado)?.valor || '💻';
  const corHex = itensLoja.find(i => i.id === perfil.corEquipada)?.valor || 'var(--primary)';
  const titulo = itensLoja.find(i => i.id === perfil.tituloEquipado)?.nome || 'Aluno';

  const handleLogout = () => { limparPerfil(); router.push('/'); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Sparkles size={24} style={{ color: 'var(--primary-light)' }} />
          <span className="font-bold text-lg hidden sm:block">Portugol Games</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => router.push('/loja')}><Store size={16} /> Loja</button>
          <button className="btn btn-secondary btn-sm" onClick={() => router.push('/ranking')}><Trophy size={16} /> Ranking</button>
          <button className="btn btn-secondary btn-sm" onClick={() => router.push('/professor')} title="Painel do Professor"><GraduationCap size={16} /></button>
          <ThemeToggle />
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} title="Sair"><LogOut size={16} /></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-8">
        <motion.div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-secondary/10 p-6 rounded-2xl border border-secondary/20" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg shrink-0" style={{ background: corHex, border: `4px solid ${corHex}40` }}>
            {avatar}
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="text-3xl font-black mb-1">
              <span style={perfil.corEquipada === 'cor-rainbow' ? { backgroundImage: corHex, WebkitBackgroundClip: 'text', color: 'transparent' } : { color: perfil.corEquipada ? corHex : 'inherit' }}>
                {perfil.nome.split(' ')[0]}
              </span>
            </h1>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-bold opacity-80 mr-2">[{titulo}]</span>
              Turma: {perfil.turma} · {completados}/3 minigames completados
            </p>
            <div className="w-full max-w-md mx-auto md:mx-0">
              <ScoreBar xp={perfil.xpTotal} maxXP={1850} label="XP Total" />
              {perfil.xpGasto > 0 && <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>Saldo atual: {perfil.xpTotal - perfil.xpGasto} XP</p>}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((g, i) => {
            const done = !!perfil.minigamesCompletados[g.key];
            const resultado = perfil.minigamesCompletados[g.key];
            return (
              <motion.div key={g.key} className="card flex flex-col cursor-pointer relative overflow-hidden" onClick={() => router.push(g.href)} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * i }} whileHover={{ y: -4 }} style={{ cursor: 'pointer' }}>
                {done && (
                  <div className="absolute top-3 right-3"><CheckCircle2 size={24} style={{ color: 'var(--success)' }} /></div>
                )}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: `${g.color}20`, color: g.color }}>{g.icon}</div>
                <h2 className="text-xl font-bold mb-2">{g.title}</h2>
                <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary">⭐ Até {g.xpMax} XP</span>
                  {done && resultado && <span className="badge badge-success">✅ {resultado.xpGanho} XP</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {perfil.badges.length > 0 && (
          <motion.div className="mt-8 card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ cursor: 'default' }}>
            <h3 className="font-bold mb-3">🏅 Suas Conquistas</h3>
            <div className="flex flex-wrap gap-2">{perfil.badges.map(b => <span key={b} className="badge badge-warning">{b}</span>)}</div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
