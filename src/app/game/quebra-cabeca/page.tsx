'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, GripVertical, SkipForward, ArrowLeftCircle, CheckCircle } from 'lucide-react';
import { exerciciosPuzzle } from '@/data/exercises-puzzle';
import { carregarPuzzleCustom } from '@/lib/custom-exercises';
import { ExercicioPuzzle } from '@/types';
import { executarPortugol } from '@/lib/portugol-interpreter';
import { calcularXPExercicio } from '@/lib/scoring';
import { getPerfil, salvarResultado, adicionarBadge, comprarDicaLocal } from '@/lib/storage';
import { FeedbackModal } from '@/components/game/FeedbackModal';
import { ScoreBar } from '@/components/game/ScoreBar';
import { Timer, useTimer } from '@/components/game/Timer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { initAudio, playClick, playPop, playDing, playError } from '@/lib/audio';
import { QuestionNav } from '@/components/game/QuestionNav';
import { ResumeModal } from '@/components/game/ResumeModal';
import { 
  salvarProgresso, 
  carregarProgresso, 
  limparProgresso, 
  buildStatuses, 
  RespostaQuestao 
} from '@/lib/progress';

export default function QuebracabecaPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [slotAssignments, setSlotAssignments] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [slotErrors, setSlotErrors] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; xp: number; bonuses: string[]; msg: string }>({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
  const [output, setOutput] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [hintsBought, setHintsBought] = useState<Set<string>>(new Set());
  const [allExercicios, setAllExercicios] = useState<ExercicioPuzzle[]>(exerciciosPuzzle);
  
  // Novos estados para progresso
  const [showResume, setShowResume] = useState(false);
  const [respostas, setRespostas] = useState<Record<number, RespostaQuestao>>({});
  const [savedSlots, setSavedSlots] = useState<Record<number, Record<string, string>>>({});
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  const timer = useTimer();
  const ex = allExercicios[idx];

  const handleBuyHint = (slotId: string) => {
    if (hintsBought.has(slotId)) return;
    if (comprarDicaLocal(20)) {
      setHintsBought(prev => new Set(prev).add(slotId));
      playPop();
    } else {
      setErrorMsg('XP insuficiente para comprar dica (necessário 20 XP).');
      playError();
    }
  };

  useEffect(() => {
    if (!getPerfil()) { router.push('/'); return; }
    timer.start();
    initAudio();
    
    carregarPuzzleCustom().then(custom => {
      let loadedExercicios = exerciciosPuzzle;
      if (custom.length > 0) {
        loadedExercicios = [...exerciciosPuzzle, ...custom];
        setAllExercicios(loadedExercicios);
      }
      
      const prog = carregarProgresso('quebra-cabeca');
      if (prog && prog.totalQuestoes === loadedExercicios.length) {
        setShowResume(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCurrentState = (targetIdx: number, targetSlots: Record<string, string>, currentRespostas: Record<number, RespostaQuestao>) => {
    const prog = {
      minigame: 'quebra-cabeca' as const,
      questaoAtual: targetIdx,
      totalQuestoes: allExercicios.length,
      respostas: currentRespostas,
      xpAcumulado: totalXP,
      acertos,
      iniciadoEm: new Date().toISOString(),
      ultimaAtualizacaoEm: new Date().toISOString(),
    };
    salvarProgresso(prog);
  };

  const usedBlockIds = new Set(Object.values(slotAssignments));
  const availableBlocks = ex?.blocos.filter(b => !usedBlockIds.has(b.id)) || [];

  const handleBlockSelect = (blockId: string) => {
    if (respostas[idx]?.correta) return;
    setSelectedBlock(blockId === selectedBlock ? null : blockId);
    playClick();
  };

  const handleDropOnSlot = (slotId: string) => {
    if (respostas[idx]?.correta) return;
    if (!selectedBlock) return;
    
    const newAssignments = { ...slotAssignments };
    for (const [sId, bId] of Object.entries(newAssignments)) {
      if (bId === selectedBlock) delete newAssignments[sId];
    }
    newAssignments[slotId] = selectedBlock;
    setSlotAssignments(newAssignments);
    setSlotErrors(prev => { const n = new Set(prev); n.delete(slotId); return n; });
    setSelectedBlock(null);
    playPop();
  };

  const handleRemoveFromSlot = (slotId: string, e: React.MouseEvent) => {
    if (respostas[idx]?.correta) return;
    e.stopPropagation();
    const newAssignments = { ...slotAssignments };
    delete newAssignments[slotId];
    setSlotAssignments(newAssignments);
    playPop();
  };

  const handleRun = () => {
    if (respostas[idx]?.correta) return;
    
    setAttempts(prev => prev + 1);
    const wrongSlots = new Set<string>();
    for (const slot of ex.slots) {
      if (slotAssignments[slot.id] !== ex.respostasCorretas[slot.id]) wrongSlots.add(slot.id);
    }
    setSlotErrors(wrongSlots);

    let code = ex.codigoTemplate;
    for (const slot of ex.slots) {
      const blockId = slotAssignments[slot.id];
      const block = ex.blocos.find(b => b.id === blockId);
      code = code.replace(`__${slot.id}__`, block?.conteudo || '');
    }

    const result = executarPortugol(code, ex.entradaSimulada);
    if (!result.sucesso) { 
      setOutput(null); 
      setErrorMsg(result.erro?.mensagem || 'Erro'); 
      playError(); 
      
      const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: false, xpGanho: 0, tentativas: attempts + 1, valorResposta: slotAssignments } };
      setRespostas(newRespostas);
      saveCurrentState(idx, slotAssignments, newRespostas);
      return; 
    }

    setOutput(result.saida);
    setErrorMsg('');
    const saidaStr = result.saida.join('\n').trim();

    if (saidaStr === ex.outputEsperado.trim() && wrongSlots.size === 0) {
      playDing();
      const semErros = attempts === 0;
      const xp = calcularXPExercicio(ex.xpMaximo, attempts + 1, semErros, false);
      const bonuses: string[] = [];
      if (semErros) bonuses.push('⭐ Bônus por 1ª tentativa!');
      
      setTotalXP(prev => prev + xp);
      setAcertos(prev => prev + 1);
      
      const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: true, xpGanho: xp, tentativas: attempts + 1, valorResposta: slotAssignments } };
      setRespostas(newRespostas);
      saveCurrentState(idx, slotAssignments, newRespostas);
      
      setFeedback({ show: true, correct: true, xp, bonuses, msg: ex.feedbackSucesso || `Saída: ${saidaStr}` });
    } else {
      playError();
      if (wrongSlots.size > 0) setErrorMsg(ex.feedbackErro || `Há ${wrongSlots.size} bloco(s) no lugar errado.`);
      else setErrorMsg(`Saída incorreta. Esperado: "${ex.outputEsperado}", obtido: "${saidaStr}"`);
      
      const newRespostas = { ...respostas, [idx]: { respondida: true, pulada: false, correta: false, xpGanho: 0, tentativas: attempts + 1, valorResposta: slotAssignments } };
      setRespostas(newRespostas);
      saveCurrentState(idx, slotAssignments, newRespostas);
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
    limparProgresso('quebra-cabeca');
    salvarResultado('puzzle', { 
      completadoEm: new Date().toISOString(), 
      xpGanho: totalXP, 
      tentativas: Object.values(respostas).reduce((acc, curr) => acc + curr.tentativas, 0) || 1, 
      acertos, 
      totalQuestoes: allExercicios.length, 
      tempoSegundos: timer.seconds 
    });
    if (acertos === allExercicios.length) adicionarBadge('⭐ Perfeição');
    router.push('/menu');
  };

  const handleNext = () => {
    setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
    
    setSavedSlots(prev => ({ ...prev, [idx]: slotAssignments }));
    
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
    setSavedSlots(prev => ({ ...prev, [idx]: slotAssignments }));
    const newRespostas = { ...respostas, [idx]: { respondida: false, pulada: true, correta: null, xpGanho: 0, tentativas: attempts, valorResposta: slotAssignments } };
    setRespostas(newRespostas);
    
    let nextIdx = idx + 1;
    if (nextIdx >= allExercicios.length) {
      nextIdx = getNextUnanswered(0);
      if (nextIdx === -1 || nextIdx === idx) {
         saveCurrentState(idx, slotAssignments, newRespostas);
         setShowFinalizeConfirm(true);
         return;
      }
    }
    
    saveCurrentState(nextIdx, savedSlots[nextIdx] || {}, newRespostas);
    navigateTo(nextIdx);
  };

  const handlePrevious = () => {
    if (idx > 0) {
      setSavedSlots(prev => ({ ...prev, [idx]: slotAssignments }));
      saveCurrentState(idx - 1, savedSlots[idx - 1] || {}, respostas);
      navigateTo(idx - 1);
    }
  };

  const navigateTo = (targetIdx: number) => {
    setSavedSlots(prev => ({ ...prev, [idx]: slotAssignments }));
    setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
    setAttempts(respostas[targetIdx]?.tentativas || 0);
    setSlotErrors(new Set());
    setHintsBought(new Set());
    setOutput(null);
    setErrorMsg('');
    setSelectedBlock(null);
    
    const targetSaved = savedSlots[targetIdx] || (respostas[targetIdx]?.valorResposta as Record<string, string>) || {};
    setSlotAssignments(targetSaved);
    setIdx(targetIdx);
    
    saveCurrentState(targetIdx, targetSaved, respostas);
  };

  const handleMenu = () => {
    setSavedSlots(prev => ({ ...prev, [idx]: slotAssignments }));
    saveCurrentState(idx, slotAssignments, respostas);
    router.push('/menu');
  };

  const handleContinue = () => {
    const prog = carregarProgresso('quebra-cabeca');
    if (prog) {
      setIdx(prog.questaoAtual);
      setTotalXP(prog.xpAcumulado);
      setAcertos(prog.acertos);
      setRespostas(prog.respostas);
      
      const loadedSaved: Record<number, Record<string, string>> = {};
      Object.entries(prog.respostas).forEach(([k, v]) => {
        if (v.valorResposta) loadedSaved[Number(k)] = v.valorResposta as Record<string, string>;
      });
      setSavedSlots(loadedSaved);
      setSlotAssignments(loadedSaved[prog.questaoAtual] || {});
      setAttempts(prog.respostas[prog.questaoAtual]?.tentativas || 0);
    }
    setShowResume(false);
  };

  const handleRestart = () => {
    limparProgresso('quebra-cabeca');
    setShowResume(false);
  };

  const renderCodeWithSlots = () => {
    if (!ex) return null;
    const parts = ex.codigoTemplate.split(/__([A-Z_0-9]+)__/);
    const isCorrect = respostas[idx]?.correta;
    
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const slot = ex.slots.find(s => s.id === part);
        if (!slot) return <span key={i}>{part}</span>;
        const blockId = slotAssignments[part];
        const block = blockId ? ex.blocos.find(b => b.id === blockId) : null;
        const hasError = slotErrors.has(part);
        return (
          <span key={i} className={`drop-zone inline-flex mx-1 ${selectedBlock && !isCorrect ? 'active' : ''} ${block ? 'filled' : ''} ${hasError ? 'error' : ''} ${isCorrect ? 'success' : ''}`}
            style={{ minWidth: `${slot.tamanhoVisual}ch`, display: 'inline-flex', cursor: isCorrect ? 'default' : 'pointer' }}
            onClick={() => handleDropOnSlot(part)}
            onDragOver={e => e.preventDefault()} onDrop={() => handleDropOnSlot(part)}>
            {block ? (
              <span className="font-mono text-sm w-full text-center" onClick={(e) => handleRemoveFromSlot(part, e)}
                style={{ color: 'var(--primary-light)' }}>{block.conteudo} {!isCorrect && <span className="ml-1 opacity-50">✕</span>}</span>
            ) : (
              <span className="text-xs w-full flex flex-col items-center justify-center gap-1 mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>solte aqui</span>
                {!hintsBought.has(part) ? (
                  <button className="btn btn-secondary text-[9px] px-1 py-0 h-4 border-none opacity-60 hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleBuyHint(part); }}>Dica 20XP</button>
                ) : (
                  <span className="text-[9px] text-warning font-bold text-center leading-tight max-w-full px-1 truncate">Use: {ex.blocos.find(b => b.id === ex.respostasCorretas[part])?.conteudo}</span>
                )}
              </span>
            )}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

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

      <main className="max-w-5xl mx-auto px-4 pb-8 flex-1 w-full">
        <ScoreBar xp={totalXP} maxXP={600} label="XP Acumulado" />

        <AnimatePresence mode="wait">
          <motion.div key={ex.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 code-block"><pre className="whitespace-pre-wrap">{renderCodeWithSlots()}</pre></div>

              <div className="card flex flex-col gap-2" style={{ cursor: 'default' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>📦 Blocos disponíveis</h3>
                {!isCorrect && <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Arraste um bloco ou toque nele e depois no espaço vazio.</p>}
                
                {availableBlocks.map(b => (
                  <div key={b.id} className={`drag-block ${selectedBlock === b.id ? 'border-primary' : ''} ${isCorrect ? 'opacity-50 cursor-not-allowed' : ''}`} style={selectedBlock === b.id ? { borderColor: 'var(--primary-light)', background: 'var(--primary-dark)' } : {}} draggable={!isCorrect} onDragStart={() => !isCorrect && handleBlockSelect(b.id)} onClick={() => !isCorrect && handleBlockSelect(b.id)}>
                    <div className="flex items-center gap-2"><GripVertical size={14} style={{ color: 'var(--text-muted)' }} /><span>{b.conteudo}</span></div>
                  </div>
                ))}
                {availableBlocks.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Todos os blocos foram colocados!</p>}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
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
                  <button className="btn btn-primary" onClick={handleRun}><Play size={18} /> Verificar e Executar</button>
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
                <h3 className="font-bold text-sm mb-2" style={{ color: output ? 'var(--success)' : 'var(--error)' }}>{output ? '📤 Saída:' : '❌ Erro:'}</h3>
                {output && <pre className="font-mono text-sm">{output.join('\n')}</pre>}
                {errorMsg && <p className="text-sm" style={{ color: 'var(--error)' }}>{errorMsg}</p>}
              </motion.div>
            )}
            
            {showFinalizeConfirm && (
               <motion.div className="mt-6 card border-warning" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                 <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle style={{color: 'var(--warning)'}}/> Finalizar Minigame?</h3>
                 <p className="mb-4" style={{color: 'var(--text-secondary)'}}>Você pulou alguns puzzles. Tem certeza que deseja finalizar agora? Puzzles pulados não darão XP.</p>
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
        onNext={handleNext} nextLabel={idx < allExercicios.length - 1 || Object.values(respostas).some(r => r.pulada && !r.correta) ? 'Próximo' : '🏆 Finalizar'} />

      <ResumeModal 
        show={showResume} 
        minigame="quebra-cabeca" 
        questaoAtual={idx} 
        totalQuestoes={allExercicios.length} 
        xpAcumulado={totalXP} 
        onContinue={handleContinue} 
        onRestart={handleRestart} 
      />
    </div>
  );
}
