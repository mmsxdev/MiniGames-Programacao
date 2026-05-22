'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Zap, SkipForward, ArrowLeftCircle } from 'lucide-react';
import { quizQuestions } from '@/data/quiz-questions';
import { carregarQuizCustom } from '@/lib/custom-exercises';
import { Pergunta } from '@/types';
import { BONUS } from '@/lib/scoring';
import { getPerfil, salvarResultado, adicionarBadge } from '@/lib/storage';
import { ScoreBar } from '@/components/game/ScoreBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QuestionNav } from '@/components/game/QuestionNav';
import { ResumeModal } from '@/components/game/ResumeModal';
import { 
  salvarProgresso, 
  carregarProgresso, 
  limparProgresso, 
  buildStatuses, 
  RespostaQuestao 
} from '@/lib/progress';

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
  
  // Novos estados para progresso
  const [showResume, setShowResume] = useState(false);
  const [respostas, setRespostas] = useState<Record<number, RespostaQuestao>>({});
  const [selectedPerQ, setSelectedPerQ] = useState<Record<number, string | null>>({});
  const [answeredPerQ, setAnsweredPerQ] = useState<Record<number, boolean>>({});
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  const q = allQuestions[idx];

  useEffect(() => {
    if (!getPerfil()) { router.push('/'); return; }
    startTimeRef.current = obterTempoAtual();
    carregarQuizCustom().then(custom => {
      let loadedQuestions = quizQuestions;
      if (custom.length > 0) {
        loadedQuestions = [...quizQuestions, ...custom];
        setAllQuestions(loadedQuestions);
      }
      
      const prog = carregarProgresso('quiz');
      if (prog && prog.totalQuestoes === loadedQuestions.length) {
        setShowResume(true);
      }
    });
  }, [router]);

  useEffect(() => {
    if (done || showResume) return;
    
    // Só roda o timer se a questão não foi respondida nem pulada
    if (!answeredPerQ[idx] && !(respostas[idx]?.pulada)) {
      startTimeRef.current = obterTempoAtual();
      timerRef.current = setInterval(() => setQTimer(t => t + 1), 1000);
    } else {
      setQTimer(0);
    }
    
    return () => clearInterval(timerRef.current);
  }, [idx, done, showResume, answeredPerQ, respostas]);

  const saveCurrentState = (targetIdx: number, currentRespostas: Record<number, RespostaQuestao>, currentSelected: Record<number, string | null>) => {
    const prog = {
      minigame: 'quiz' as const,
      questaoAtual: targetIdx,
      totalQuestoes: allQuestions.length,
      respostas: currentRespostas,
      xpAcumulado: totalXP,
      acertos,
      iniciadoEm: new Date().toISOString(),
      ultimaAtualizacaoEm: new Date().toISOString(),
    };
    // Save selected values inside respostas to be loaded easily
    Object.keys(currentSelected).forEach(k => {
      if (prog.respostas[Number(k)]) {
        prog.respostas[Number(k)].valorResposta = currentSelected[Number(k)];
      }
    });
    salvarProgresso(prog);
  };

  const handleSelect = (optId: string) => {
    if (answered || answeredPerQ[idx]) return;
    setSelected(optId);
    setAnswered(true);
    clearInterval(timerRef.current);

    const opt = q.opcoes.find(o => o.id === optId);
    const isCorrect = opt?.correta ?? false;
    const elapsed = (obterTempoAtual() - startTimeRef.current) / 1000;
    const wasRapido = q.tempoBonusSegundos ? elapsed <= q.tempoBonusSegundos : false;

    let xpGanho = 0;
    let newStreak = streak;
    
    if (isCorrect) {
      setAcertos(prev => prev + 1);
      newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      xpGanho = q.xpBase;
      if (wasRapido) xpGanho += BONUS.rapido;
      xpGanho += newStreak * BONUS.streakCorreta;
      setTotalXP(prev => prev + xpGanho);
    } else {
      setStreak(0);
    }
    
    const newResults = [...results, isCorrect];
    setResults(newResults);
    
    const newSelectedPerQ = { ...selectedPerQ, [idx]: optId };
    setSelectedPerQ(newSelectedPerQ);
    
    const newAnsweredPerQ = { ...answeredPerQ, [idx]: true };
    setAnsweredPerQ(newAnsweredPerQ);
    
    const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: isCorrect, xpGanho, tentativas: 1, valorResposta: optId } };
    setRespostas(newRespostas);
    
    saveCurrentState(idx, newRespostas, newSelectedPerQ);
  };

  const getNextUnanswered = (startIdx: number) => {
    for (let i = startIdx; i < allQuestions.length; i++) {
      if (!respostas[i] || (!respostas[i].respondida && !respostas[i].pulada)) return i;
    }
    return -1;
  };

  const finalizeGame = () => {
    setDone(true);
    clearInterval(timerRef.current);
    const totalTime = Math.round((obterTempoAtual() - startTimeRef.current) / 1000);
    
    // Contabiliza acertos das respostas salvas para garantir precisão
    const finalAcertos = Object.values(respostas).filter(r => r.correta).length;
    
    salvarResultado('quiz', { completadoEm: new Date().toISOString(), xpGanho: totalXP, tentativas: 1, acertos: finalAcertos, totalQuestoes: allQuestions.length, tempoSegundos: totalTime });
    if (finalAcertos === allQuestions.length) adicionarBadge('🧠 Mestre do Quiz');
    if (maxStreak >= 5) adicionarBadge('🔥 Em Chamas');
    limparProgresso('quiz');
  };

  const handleNext = () => {
    const nextIdx = getNextUnanswered(idx + 1) !== -1 ? getNextUnanswered(idx + 1) : getNextUnanswered(0);
    
    if (nextIdx !== -1) {
      navigateTo(nextIdx);
    } else {
      const hasSkipped = Object.values(respostas).some(r => r.pulada);
      if (hasSkipped) {
         setShowFinalizeConfirm(true);
      } else {
         finalizeGame();
      }
    }
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    
    const newSelectedPerQ = { ...selectedPerQ, [idx]: selected };
    setSelectedPerQ(newSelectedPerQ);
    
    const newRespostas = { ...respostas, [idx]: { respondida: false, pulada: true, correta: null, xpGanho: 0, tentativas: 0, valorResposta: selected } };
    setRespostas(newRespostas);
    
    let nextIdx = idx + 1;
    if (nextIdx >= allQuestions.length) {
      nextIdx = getNextUnanswered(0);
      if (nextIdx === -1 || nextIdx === idx) {
         saveCurrentState(idx, newRespostas, newSelectedPerQ);
         setShowFinalizeConfirm(true);
         return;
      }
    }
    
    saveCurrentState(nextIdx, newRespostas, newSelectedPerQ);
    navigateTo(nextIdx);
  };

  const handlePrevious = () => {
    if (idx > 0) {
      navigateTo(idx - 1);
    }
  };

  const navigateTo = (targetIdx: number) => {
    clearInterval(timerRef.current);
    
    // Se a questão alvo já foi respondida, carrega o estado
    const isTargetAnswered = answeredPerQ[targetIdx] || (respostas[targetIdx]?.respondida === true);
    
    // Se for pulada, permite responder normalmente
    const isTargetSkipped = respostas[targetIdx]?.pulada === true;
    
    setSelected(selectedPerQ[targetIdx] || null);
    setAnswered(isTargetAnswered);
    
    // Se estava pulada, ao navegar de volta desmarcamos como pulada para que o timer rode
    if (isTargetSkipped) {
      const newRespostas = { ...respostas };
      delete newRespostas[targetIdx];
      setRespostas(newRespostas);
    }
    
    setQTimer(0);
    setIdx(targetIdx);
    
    saveCurrentState(targetIdx, respostas, selectedPerQ);
  };

  const handleMenu = () => {
    saveCurrentState(idx, respostas, selectedPerQ);
    router.push('/menu');
  };

  const handleContinue = () => {
    const prog = carregarProgresso('quiz');
    if (prog) {
      setIdx(prog.questaoAtual);
      setTotalXP(prog.xpAcumulado);
      setAcertos(prog.acertos);
      setRespostas(prog.respostas);
      
      const loadedSelected: Record<number, string | null> = {};
      const loadedAnswered: Record<number, boolean> = {};
      
      Object.entries(prog.respostas).forEach(([k, v]) => {
        if (v.valorResposta) loadedSelected[Number(k)] = v.valorResposta as string;
        if (v.respondida) loadedAnswered[Number(k)] = true;
      });
      
      setSelectedPerQ(loadedSelected);
      setAnsweredPerQ(loadedAnswered);
      
      const isCurrentAnswered = loadedAnswered[prog.questaoAtual] || false;
      setSelected(loadedSelected[prog.questaoAtual] || null);
      setAnswered(isCurrentAnswered);
    }
    setShowResume(false);
  };

  const handleRestart = () => {
    limparProgresso('quiz');
    setShowResume(false);
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
            {allQuestions.map((q, i) => {
              const resp = respostas[i];
              let icon = <XCircle size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />;
              if (resp?.correta) icon = <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />;
              else if (resp?.pulada) icon = <SkipForward size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />;
              
              return (
                <div key={q.id} className="flex items-center gap-2 text-sm py-1">
                  {icon}
                  <span className="truncate">{q.enunciado}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary flex-1" onClick={() => router.push('/menu')}>Menu</button>
            <button className="btn btn-primary flex-1" onClick={() => router.push('/ranking')}>🏆 Ver Ranking</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const statuses = buildStatuses(allQuestions.length, idx, respostas);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex flex-col gap-2 p-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <button className="btn btn-secondary btn-sm" onClick={handleMenu}><ArrowLeft size={16} /> Menu</button>
          <div className="flex items-center gap-3">
            <span className="badge badge-primary">{idx + 1}/{allQuestions.length}</span>
            {streak > 1 && <span className="badge badge-warning">🔥 {streak}x streak</span>}
            <ThemeToggle />
          </div>
        </div>
        <QuestionNav total={allQuestions.length} current={idx} statuses={statuses} onNavigate={navigateTo} />
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-8 w-full flex-1">
        <ScoreBar xp={totalXP} maxXP={750} label="XP Acumulado" />
        <div className="progress-bar mt-2 mb-6"><div className="progress-fill" style={{ width: `${((idx + 1) / allQuestions.length) * 100}%` }} /></div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="card mb-4" style={{ cursor: 'default' }}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${q.dificuldade === 'facil' ? 'badge-success' : q.dificuldade === 'medio' ? 'badge-warning' : 'badge-error'}`}>{q.dificuldade}</span>
                  {q.rank && (
                    <span className="badge text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-none">
                      🏆 {q.rank}
                    </span>
                  )}
                  {q.badge && (
                    <span className="badge text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-none">
                      {q.badge}
                    </span>
                  )}
                </div>
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

            <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={handlePrevious} disabled={idx === 0}>
                  <ArrowLeftCircle size={18} /> Anterior
                </button>
                
                {!answered && (
                   <button className="btn btn-secondary" onClick={handleSkip}>
                     Pular <SkipForward size={18} />
                   </button>
                )}
              </div>

              {answered && (
                <div className="flex-1 max-w-xs">
                  <button className="btn btn-primary w-full" onClick={handleNext}>
                    {getNextUnanswered(idx + 1) !== -1 || getNextUnanswered(0) !== -1 ? 'Próxima Pergunta →' : '🏆 Finalizar'}
                  </button>
                </div>
              )}
            </div>

            {showFinalizeConfirm && (
               <motion.div className="mt-6 card border-warning" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                 <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle style={{color: 'var(--warning)'}}/> Finalizar Quiz?</h3>
                 <p className="mb-4" style={{color: 'var(--text-secondary)'}}>Você pulou algumas questões. Tem certeza que deseja finalizar agora? Questões puladas não darão XP.</p>
                 <div className="flex gap-3">
                   <button className="btn btn-secondary flex-1" onClick={() => setShowFinalizeConfirm(false)}>Voltar e Revisar</button>
                   <button className="btn btn-primary flex-1 bg-warning hover:bg-warning/80 text-black border-none" onClick={finalizeGame}>Finalizar Mesmo Assim</button>
                 </div>
               </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
      
      <ResumeModal 
        show={showResume} 
        minigame="quiz" 
        questaoAtual={idx} 
        totalQuestoes={allQuestions.length} 
        xpAcumulado={totalXP} 
        onContinue={handleContinue} 
        onRestart={handleRestart} 
      />
    </div>
  );
}
