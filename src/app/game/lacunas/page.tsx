'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Lightbulb, SkipForward, ArrowLeftCircle, CheckCircle } from 'lucide-react';
import { exerciciosLacunas } from '@/data/exercises-lacunas';
import { carregarLacunasCustom } from '@/lib/custom-exercises';
import { ExercicioLacuna } from '@/types';
import { executarPortugol } from '@/lib/portugol-interpreter';
import { calcularXPExercicio } from '@/lib/scoring';
import { getPerfil, salvarResultado, adicionarBadge, comprarDicaLocal } from '@/lib/storage';
import { FeedbackModal } from '@/components/game/FeedbackModal';
import { ScoreBar } from '@/components/game/ScoreBar';
import { Timer, useTimer } from '@/components/game/Timer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { initAudio, playPop, playDing, playError } from '@/lib/audio';
import { QuestionNav } from '@/components/game/QuestionNav';
import { ResumeModal } from '@/components/game/ResumeModal';
import { 
  salvarProgresso, 
  carregarProgresso, 
  limparProgresso, 
  buildStatuses, 
  RespostaQuestao 
} from '@/lib/progress';

export default function LacunasPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; xp: number; bonuses: string[]; msg: string }>({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [output, setOutput] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [acertos, setAcertos] = useState(0);
  
  const [hintsBought, setHintsBought] = useState<Set<string>>(new Set());
  const [savedHints, setSavedHints] = useState<Record<number, string[]>>({});
  
  const [allExercicios, setAllExercicios] = useState<ExercicioLacuna[]>(exerciciosLacunas);
  
  const [showResume, setShowResume] = useState(false);
  const [respostas, setRespostas] = useState<Record<number, RespostaQuestao>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, Record<string, string>>>({});
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);

  const timer = useTimer();
  const ex = allExercicios[idx];

  const handleBuyHint = (lacunaId: string) => {
    if (hintsBought.has(lacunaId)) return;
    
    const custo = 20;
    const newHints = new Set(hintsBought).add(lacunaId);
    
    if (totalXP >= custo) {
      setTotalXP(prev => prev - custo);
      setHintsBought(newHints);
      const newSavedHints = { ...savedHints, [idx]: Array.from(newHints) };
      setSavedHints(newSavedHints);
      saveCurrentState(idx, respostas, newSavedHints, totalXP - custo);
      playPop();
    } else {
      const restante = custo - totalXP;
      if (comprarDicaLocal(restante)) {
        setTotalXP(0);
        setHintsBought(newHints);
        const newSavedHints = { ...savedHints, [idx]: Array.from(newHints) };
        setSavedHints(newSavedHints);
        saveCurrentState(idx, respostas, newSavedHints, 0);
        playPop();
      } else {
        setErrorMsg('XP insuficiente para comprar dica (necessário 20 XP na sessão ou no perfil).');
        playError();
      }
    }
  };

  useEffect(() => {
    if (!getPerfil()) { router.push('/'); return; }
    timer.start();
    initAudio();
    
    carregarLacunasCustom().then(custom => {
      let loadedExercicios = exerciciosLacunas;
      if (custom.length > 0) {
        loadedExercicios = [...exerciciosLacunas, ...custom];
        setAllExercicios(loadedExercicios);
      }
      
      const prog = carregarProgresso('lacunas');
      if (prog && prog.totalQuestoes === loadedExercicios.length && Object.keys(prog.respostas).length > 0) {
        setResumeData(prog);
        setShowResume(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCurrentState = (targetIdx: number, currentRespostas: Record<number, RespostaQuestao>, currentSavedHints: Record<number, string[]>, overrideXP?: number) => {
    const prog = {
      minigame: 'lacunas' as const,
      questaoAtual: targetIdx,
      totalQuestoes: allExercicios.length,
      respostas: currentRespostas,
      xpAcumulado: overrideXP !== undefined ? overrideXP : totalXP,
      acertos,
      iniciadoEm: new Date().toISOString(),
      ultimaAtualizacaoEm: new Date().toISOString(),
      hintsComprados: currentSavedHints,
    };
    salvarProgresso(prog);
  };

  const handleChange = (lacunaId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [lacunaId]: value }));
    setErrors(prev => { const n = new Set(prev); n.delete(lacunaId); return n; });
    playPop();
  };

  const handleRun = () => {
    if (respostas[idx]?.correta) return; 
    setAttempts(prev => prev + 1);
    
    const wrongIds = new Set<string>();
    for (const lac of ex.lacunas) {
      const userVal = (answers[lac.id] || '').trim();
      const correctVal = ex.respostasCorretas[lac.id];
      if (userVal.toLowerCase() !== correctVal.toLowerCase()) wrongIds.add(lac.id);
    }
    setErrors(wrongIds);

    let code = ex.codigoTemplate;
    for (const lac of ex.lacunas) {
      code = code.replace(`__${lac.id}__`, answers[lac.id] || '');
    }

    const result = executarPortugol(code, ex.entradaSimulada);
    if (!result.sucesso) {
      setOutput(null);
      setErrorMsg(result.erro?.mensagem || 'Erro na execução');
      
      const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: false, xpGanho: 0, tentativas: attempts + 1, valorResposta: answers } };
      setRespostas(newRespostas);
      
      const newSavedHints = { ...savedHints, [idx]: Array.from(hintsBought) };
      setSavedHints(newSavedHints);
      saveCurrentState(idx, newRespostas, newSavedHints);
      return;
    }

    setOutput(result.saida);
    setErrorMsg('');
    const saidaStr = result.saida.join('\n').trim();
    const esperado = ex.outputEsperado.trim();

    if (saidaStr === esperado && wrongIds.size === 0) {
      playDing();
      const semErros = attempts === 0;
      const xp = calcularXPExercicio(ex.xpMaximo, attempts + 1, semErros, false);
      const bonuses: string[] = [];
      if (semErros) { bonuses.push('⭐ Bônus por 1ª tentativa!'); adicionarBadge('🎯 Primeiro Acerto'); }
      
      setTotalXP(prev => prev + xp);
      setAcertos(prev => prev + 1);
      
      const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: true, xpGanho: xp, tentativas: attempts + 1, valorResposta: answers } };
      setRespostas(newRespostas);
      
      const newSavedHints = { ...savedHints, [idx]: Array.from(hintsBought) };
      setSavedHints(newSavedHints);
      saveCurrentState(idx, newRespostas, newSavedHints, totalXP + xp);
      
      setFeedback({ show: true, correct: true, xp, bonuses, msg: ex.feedbackSucesso || `Saída: ${saidaStr}` });
    } else {
      playError();
      setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
      if (wrongIds.size > 0) setErrorMsg(ex.feedbackErro || `Há ${wrongIds.size} lacuna(s) incorreta(s). Verifique os campos em vermelho.`);
      else setErrorMsg(`Saída incorreta. Esperado: "${esperado}", obtido: "${saidaStr}"`);
      
      const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: false, xpGanho: 0, tentativas: attempts + 1, valorResposta: answers } };
      setRespostas(newRespostas);
      
      const newSavedHints = { ...savedHints, [idx]: Array.from(hintsBought) };
      setSavedHints(newSavedHints);
      saveCurrentState(idx, newRespostas, newSavedHints);
    }
  };

  const getNextUnanswered = (startIdx: number) => {
    for (let i = startIdx; i < allExercicios.length; i++) {
      if (!respostas[i] || (!respostas[i].correta && !respostas[i].pulada)) return i;
    }
    return -1;
  };

  const finalizeGame = () => {
    timer.stop();
    limparProgresso('lacunas');
    salvarResultado('lacunas', {
      completadoEm: new Date().toISOString(),
      xpGanho: totalXP,
      tentativas: Object.values(respostas).reduce((acc, curr) => acc + curr.tentativas, 0) || 1,
      acertos,
      totalQuestoes: allExercicios.length,
      tempoSegundos: timer.seconds,
    });
    if (acertos === allExercicios.length) adicionarBadge('⭐ Perfeição');
    router.push('/menu');
  };

  const handleNext = () => {
    setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
    
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
    const newRespostas = { ...respostas, [idx]: { respondida: false, pulada: true, correta: null, xpGanho: 0, tentativas: attempts, valorResposta: answers } };
    setRespostas(newRespostas);
    
    let nextIdx = idx + 1;
    if (nextIdx >= allExercicios.length) {
      nextIdx = getNextUnanswered(0);
      if (nextIdx === -1 || nextIdx === idx) {
         const newSavedHints = { ...savedHints, [idx]: Array.from(hintsBought) };
         saveCurrentState(idx, newRespostas, newSavedHints);
         setShowFinalizeConfirm(true);
         return;
      }
    }
    
    navigateTo(nextIdx, newRespostas);
  };

  const handlePrevious = () => {
    if (idx > 0) {
      navigateTo(idx - 1);
    }
  };

  const navigateTo = (targetIdx: number, overrideRespostas?: Record<number, RespostaQuestao>) => {
    const finalRespostas = overrideRespostas || respostas;
    
    const newSavedAnswers = { ...savedAnswers, [idx]: answers };
    setSavedAnswers(newSavedAnswers);
    
    const newSavedHints = { ...savedHints, [idx]: Array.from(hintsBought) };
    setSavedHints(newSavedHints);

    setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
    setAttempts(finalRespostas[targetIdx]?.tentativas || 0);
    setErrors(new Set());
    setOutput(null);
    setErrorMsg('');
    
    // Restaura
    const targetSaved = newSavedAnswers[targetIdx] || (finalRespostas[targetIdx]?.valorResposta as Record<string, string>) || {};
    setAnswers(targetSaved);
    
    const targetHints = newSavedHints[targetIdx] || [];
    setHintsBought(new Set(targetHints));
    
    setIdx(targetIdx);
    
    saveCurrentState(targetIdx, finalRespostas, newSavedHints);
  };

  const handleMenu = () => {
    const newSavedHints = { ...savedHints, [idx]: Array.from(hintsBought) };
    saveCurrentState(idx, respostas, newSavedHints);
    router.push('/menu');
  };

  const handleContinue = () => {
    const prog = carregarProgresso('lacunas');
    if (prog) {
      setIdx(prog.questaoAtual);
      setTotalXP(prog.xpAcumulado);
      setAcertos(prog.acertos);
      setRespostas(prog.respostas);
      
      const loadedSaved: Record<number, Record<string, string>> = {};
      Object.entries(prog.respostas).forEach(([k, v]) => {
        if (v.valorResposta) loadedSaved[Number(k)] = v.valorResposta as Record<string, string>;
      });
      setSavedAnswers(loadedSaved);
      setAnswers(loadedSaved[prog.questaoAtual] || {});
      setAttempts(prog.respostas[prog.questaoAtual]?.tentativas || 0);
      
      if (prog.hintsComprados) {
        setSavedHints(prog.hintsComprados);
        setHintsBought(new Set(prog.hintsComprados[prog.questaoAtual] || []));
      }
    }
    setShowResume(false);
  };

  const handleRestart = () => {
    limparProgresso('lacunas');
    setShowResume(false);
  };

  const renderCode = useCallback(() => {
    if (!ex) return null;
    const parts = ex.codigoTemplate.split(/__([A-Z_0-9]+)__/);
    const isCorrect = respostas[idx]?.correta;

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const lacuna = ex.lacunas.find(l => l.id === part);
        if (!lacuna) return <span key={i}>{part}</span>;
        const hasError = errors.has(part);
        return (
          <input key={i} className={`input-code ${hasError ? 'error' : answers[part] ? 'filled' : ''} ${isCorrect ? 'success' : ''}`}
            style={{ width: `calc(${Math.max(lacuna.tamanhoVisual, 4)}ch + 16px)` }}
            placeholder={`...`} value={answers[part] || ''}
            onChange={e => handleChange(part, e.target.value)}
            disabled={isCorrect === true}
            title={lacuna.dica} />
        );
      }
      return <span key={i}>{part}</span>;
    });
  }, [ex, answers, errors, idx, respostas]);

  if (!ex) return null;

  const statuses = buildStatuses(allExercicios.length, idx, respostas);
  const isCorrect = respostas[idx]?.correta;
  const allAnsweredOrSkipped = Object.keys(respostas).length === allExercicios.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-5xl mx-auto w-full">
        <button className="btn btn-secondary btn-sm" onClick={handleMenu}><ArrowLeft size={16} /> Menu</button>
        <div className="flex items-center gap-3">
          <Timer running={timer.running && !showResume} />
          <span className="badge badge-primary">Exercício {idx + 1}/{allExercicios.length}</span>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full">
        <QuestionNav total={allExercicios.length} current={idx} statuses={statuses} onNavigate={navigateTo} />
      </div>

      <main className="max-w-4xl mx-auto px-4 pb-8 flex-1 w-full">
        <ScoreBar xp={totalXP} maxXP={500} label="XP Acumulado" />

        <AnimatePresence mode="wait">
          <motion.div key={ex.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="mt-6 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{ex.titulo}</h2>
                <span className={`badge ${ex.dificuldade === 'facil' ? 'badge-success' : ex.dificuldade === 'medio' ? 'badge-warning' : 'badge-error'}`}>{ex.dificuldade}</span>
                {ex.rank && (
                  <span className="badge text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-none">
                    🏆 {ex.rank}
                  </span>
                )}
                {ex.badge && (
                  <span className="badge text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-none">
                    {ex.badge}
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>{ex.descricao}</p>
            </div>

            <div className="code-block mb-4"><pre className="whitespace-pre-wrap">{renderCode()}</pre></div>

            <div className="flex flex-wrap gap-2 mb-4">
              {ex.lacunas.map(l => {
                const isBought = hintsBought.has(l.id);
                const correta = ex.respostasCorretas[l.id];
                return (
                  <div key={l.id} className="flex items-center gap-1 text-xs" style={{ color: errors.has(l.id) ? 'var(--error)' : 'var(--text-muted)' }}>
                    <Lightbulb size={12} /> {l.id}: {l.dica}
                    {!isBought && !isCorrect ? (
                      <button className="btn btn-secondary text-[10px] px-2 py-0 ml-1 rounded h-5" onClick={() => handleBuyHint(l.id)}>
                        Revelar Primeira Letra (-20 XP)
                      </button>
                    ) : isBought || isCorrect ? (
                      <span className="badge badge-warning text-[10px] ml-1 py-0 h-5 flex items-center">Começa com "{correta.charAt(0)}"</span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={handlePrevious} disabled={idx === 0}>
                  <ArrowLeftCircle size={18} /> Anterior
                </button>
                
                {(!isCorrect || (isCorrect && !allAnsweredOrSkipped)) && (
                   <button className="btn btn-secondary" onClick={handleSkip}>
                     Pular <SkipForward size={18} />
                   </button>
                )}
              </div>
              
              <div className="flex gap-3">
                {!isCorrect ? (
                  <button className="btn btn-primary" onClick={handleRun}><Play size={18} /> Executar</button>
                ) : (
                  <div className="flex items-center gap-2 text-success font-bold">
                    <CheckCircle size={20} /> Correto!
                  </div>
                )}
                {attempts > 0 && <span className="badge badge-warning self-center">Tentativa {attempts}</span>}
              </div>
            </div>

            {(output || errorMsg) && (
              <motion.div className="mt-4 card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ cursor: 'default' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: output ? 'var(--success)' : 'var(--error)' }}>
                  {output ? '📤 Saída do programa:' : '❌ Erro:'}
                </h3>
                {output && <pre className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{output.join('\n')}</pre>}
                {errorMsg && <p className="text-sm" style={{ color: 'var(--error)' }}>{errorMsg}</p>}
              </motion.div>
            )}
            
            {showFinalizeConfirm && (
               <motion.div className="mt-6 card border-warning" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                 <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle style={{color: 'var(--warning)'}}/> Finalizar Minigame?</h3>
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

      <FeedbackModal show={feedback.show} correct={feedback.correct} xpGained={feedback.xp} bonuses={feedback.bonuses} message={feedback.msg}
        onNext={handleNext} nextLabel={idx < allExercicios.length - 1 || Object.values(respostas).some(r => r.pulada && !r.correta) ? 'Próximo Exercício' : '🏆 Finalizar'} />

      <ResumeModal 
        show={showResume} 
        minigame="lacunas" 
        questaoAtual={resumeData ? resumeData.questaoAtual : idx} 
        totalQuestoes={allExercicios.length} 
        xpAcumulado={resumeData ? resumeData.xpAcumulado : totalXP} 
        onContinue={handleContinue} 
        onRestart={handleRestart} 
      />
    </div>
  );
}
