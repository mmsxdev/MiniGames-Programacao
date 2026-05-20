'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Zap } from 'lucide-react';
import { quizQuestions } from '@/data/quiz-questions';
import { carregarQuizCustom } from '@/lib/custom-exercises';
import { Pergunta } from '@/types';
import { BONUS } from '@/lib/scoring';
import { getPerfil, salvarResultado, adicionarBadge } from '@/lib/storage';
import { ScoreBar } from '@/components/game/ScoreBar';
import { ThemeToggle } from '@/components/ThemeToggle';

// Função utilitária externa pura para manter o render React determinístico
const obterTempoAtual = () => Date.now();

export default function QuizPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [qTimer, setQTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const startTimeRef = useRef(0);
  const [allQuestions, setAllQuestions] = useState<Pergunta[]>(quizQuestions);

  const q = allQuestions[idx];

  useEffect(() => {
    if (!getPerfil()) { router.push('/'); return; }
    startTimeRef.current = obterTempoAtual();
    carregarQuizCustom().then(custom => {
      if (custom.length > 0) {
        setAllQuestions([...quizQuestions, ...custom]);
      }
    });
  }, [router]);

  useEffect(() => {
    if (done) return;
    startTimeRef.current = obterTempoAtual();
    timerRef.current = setInterval(() => setQTimer(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, done]);

  const handleSelect = (optId: string) => {
    if (answered) return;
    setSelected(optId);
    setAnswered(true);
    clearInterval(timerRef.current);

    const opt = q.opcoes.find(o => o.id === optId);
    const isCorrect = opt?.correta ?? false;
    const elapsed = (obterTempoAtual() - startTimeRef.current) / 1000;
    const wasRapido = q.tempoBonusSegundos ? elapsed <= q.tempoBonusSegundos : false;

    if (isCorrect) {
      setAcertos(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      let xpGanho = q.xpBase;
      if (wasRapido) xpGanho += BONUS.rapido;
      xpGanho += newStreak * BONUS.streakCorreta;
      setTotalXP(prev => prev + xpGanho);
    } else {
      setStreak(0);
    }
    setResults(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    setSelected(null);
    setAnswered(false);
    if (idx < allQuestions.length - 1) {
      setIdx(idx + 1);
      setQTimer(0); // Reseta o cronômetro da pergunta no evento de transição, evitando cascading render no useEffect
    } else {
      setDone(true);
      clearInterval(timerRef.current);
      const finalAcertos = acertos + (results[results.length - 1] ? 0 : 0); // already counted
      const totalTime = Math.round((obterTempoAtual() - startTimeRef.current) / 1000);
      salvarResultado('quiz', { completadoEm: new Date().toISOString(), xpGanho: totalXP, tentativas: 1, acertos: finalAcertos, totalQuestoes: allQuestions.length, tempoSegundos: totalTime });
      if (finalAcertos === allQuestions.length) adicionarBadge('🧠 Mestre do Quiz');
      if (maxStreak >= 5) adicionarBadge('🔥 Em Chamas');
    }
  };

  if (done) {
    const pct = Math.round((acertos / allQuestions.length) * 100);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
        <motion.div className="card max-w-lg w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ cursor: 'default' }}>
          <h1 className="text-3xl font-black mb-4">🎉 Quiz Finalizado!</h1>
          <div className="donut-chart mx-auto mb-4" style={{ background: `conic-gradient(var(--success) ${pct}%, var(--bg-secondary) ${pct}%)` }}>
            <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
              <span className="text-3xl font-black">{pct}%</span>
            </div>
          </div>
          <p className="text-lg mb-2">{acertos}/{allQuestions.length} acertos</p>
          <div className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-light)' }}>+{totalXP} XP</div>
          <div className="flex flex-col gap-1 mb-6 text-left max-h-48 overflow-y-auto">
            {allQuestions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-2 text-sm py-1">
                {results[i] ? <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} /> : <XCircle size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />}
                <span className="truncate">{q.enunciado}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary flex-1" onClick={() => router.push('/menu')}>Menu</button>
            <button className="btn btn-primary flex-1" onClick={() => router.push('/ranking')}>🏆 Ver Ranking</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-3xl mx-auto">
        <button className="btn btn-secondary btn-sm" onClick={() => router.push('/menu')}><ArrowLeft size={16} /> Menu</button>
        <div className="flex items-center gap-3">
          <span className="badge badge-primary">{idx + 1}/{allQuestions.length}</span>
          {streak > 1 && <span className="badge badge-warning">🔥 {streak}x streak</span>}
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-8">
        <ScoreBar xp={totalXP} maxXP={750} label="XP Acumulado" />
        <div className="progress-bar mt-2 mb-6"><div className="progress-fill" style={{ width: `${((idx + 1) / allQuestions.length) * 100}%` }} /></div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="card mb-4" style={{ cursor: 'default' }}>
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${q.dificuldade === 'facil' ? 'badge-success' : q.dificuldade === 'medio' ? 'badge-warning' : 'badge-error'}`}>{q.dificuldade}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{q.categoria}</span>
                  {q.tempoBonusSegundos && !answered && (
                    <span className="badge badge-primary"><Zap size={12} /> {Math.max(0, q.tempoBonusSegundos - qTimer)}s bônus</span>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-3">{q.enunciado}</h2>
              {q.codigoIlustrativo && <pre className="code-block text-sm mb-4">{q.codigoIlustrativo}</pre>}
            </div>

            <div className="flex flex-col gap-3">
              {q.opcoes.map((opt, oi) => {
                let cls = 'quiz-option';
                if (answered && opt.correta) cls += ' correct';
                else if (answered && selected === opt.id && !opt.correta) cls += ' wrong';
                else if (selected === opt.id) cls += ' selected';
                return (
                  <motion.button key={opt.id} className={cls} onClick={() => handleSelect(opt.id)} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: oi * 0.05 }} disabled={answered}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--bg-secondary)', flexShrink: 0 }}>{String.fromCharCode(65 + oi)}</span>
                      <span>{opt.texto}</span>
                    </div>
                    {answered && opt.explicacao && (selected === opt.id || opt.correta) && (
                      <p className="text-sm mt-2 ml-11" style={{ color: 'var(--text-secondary)' }}>{opt.explicacao}</p>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {answered && (
              <motion.div className="mt-4" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <button className="btn btn-primary w-full" onClick={handleNext}>
                  {idx < allQuestions.length - 1 ? 'Próxima Pergunta →' : '🏆 Ver Resultado'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
