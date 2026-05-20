'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, GripVertical } from 'lucide-react';
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
      if (custom.length > 0) {
        setAllExercicios([...exerciciosPuzzle, ...custom]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usedBlockIds = new Set(Object.values(slotAssignments));
  const availableBlocks = ex.blocos.filter(b => !usedBlockIds.has(b.id));

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlock(blockId === selectedBlock ? null : blockId);
    playClick();
  };

  const handleDropOnSlot = (slotId: string) => {
    if (!selectedBlock) return;
    // Remove from other slot if already placed
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
    e.stopPropagation();
    const newAssignments = { ...slotAssignments };
    delete newAssignments[slotId];
    setSlotAssignments(newAssignments);
    playPop();
  };

  const handleRun = () => {
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
    if (!result.sucesso) { setOutput(null); setErrorMsg(result.erro?.mensagem || 'Erro'); playError(); return; }

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
      setFeedback({ show: true, correct: true, xp, bonuses, msg: `Saída: ${saidaStr}` });
    } else {
      playError();
      if (wrongSlots.size > 0) setErrorMsg(`Há ${wrongSlots.size} bloco(s) no lugar errado.`);
      else setErrorMsg(`Saída incorreta. Esperado: "${ex.outputEsperado}", obtido: "${saidaStr}"`);
    }
  };

  const handleNext = () => {
    setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
    setSlotAssignments({});
    setAttempts(0);
    setSlotErrors(new Set());
    setHintsBought(new Set());
    setOutput(null);
    setErrorMsg('');
    if (idx < allExercicios.length - 1) { setIdx(idx + 1); }
    else {
      timer.stop();
      salvarResultado('puzzle', { completadoEm: new Date().toISOString(), xpGanho: totalXP, tentativas: attempts, acertos, totalQuestoes: allExercicios.length, tempoSegundos: timer.seconds });
      if (acertos === allExercicios.length) adicionarBadge('⭐ Perfeição');
      router.push('/menu');
    }
  };

  const renderCodeWithSlots = () => {
    const parts = ex.codigoTemplate.split(/__([A-Z_0-9]+)__/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const slot = ex.slots.find(s => s.id === part);
        if (!slot) return <span key={i}>{part}</span>;
        const blockId = slotAssignments[part];
        const block = blockId ? ex.blocos.find(b => b.id === blockId) : null;
        const hasError = slotErrors.has(part);
        return (
          <span key={i} className={`drop-zone inline-flex mx-1 ${selectedBlock ? 'active' : ''} ${block ? 'filled' : ''} ${hasError ? 'error' : ''}`}
            style={{ minWidth: `${slot.tamanhoVisual}ch`, display: 'inline-flex' }}
            onClick={() => handleDropOnSlot(part)}
            onDragOver={e => e.preventDefault()} onDrop={() => handleDropOnSlot(part)}>
            {block ? (
              <span className="font-mono text-sm cursor-pointer w-full text-center" onClick={(e) => handleRemoveFromSlot(part, e)}
                style={{ color: 'var(--primary-light)' }}>{block.conteudo} <span className="ml-1 opacity-50">✕</span></span>
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <button className="btn btn-secondary btn-sm" onClick={() => router.push('/menu')}><ArrowLeft size={16} /> Menu</button>
        <div className="flex items-center gap-3">
          <Timer running={timer.running} />
          <span className="badge badge-primary">Exercício {idx + 1}/{allExercicios.length}</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-8">
        <ScoreBar xp={totalXP} maxXP={600} label="XP Acumulado" />

        <AnimatePresence mode="wait">
          <motion.div key={ex.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
            <div className="mt-6 mb-4">
              <h2 className="text-2xl font-bold mb-1">{ex.titulo}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{ex.descricao}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 code-block"><pre className="whitespace-pre-wrap">{renderCodeWithSlots()}</pre></div>

              <div className="card flex flex-col gap-2" style={{ cursor: 'default' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>📦 Blocos disponíveis</h3>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Arraste um bloco ou toque nele e depois no espaço vazio.</p>
                {availableBlocks.map(b => (
                  <div key={b.id} className={`drag-block ${selectedBlock === b.id ? 'border-primary' : ''}`} style={selectedBlock === b.id ? { borderColor: 'var(--primary-light)', background: 'var(--primary-dark)' } : {}} draggable onDragStart={() => handleBlockSelect(b.id)} onClick={() => handleBlockSelect(b.id)}>
                    <div className="flex items-center gap-2"><GripVertical size={14} style={{ color: 'var(--text-muted)' }} /><span>{b.conteudo}</span></div>
                  </div>
                ))}
                {availableBlocks.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Todos os blocos foram colocados!</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="btn btn-primary" onClick={handleRun}><Play size={18} /> Verificar e Executar</button>
              {attempts > 0 && <span className="badge badge-warning self-center">Tentativa {attempts}</span>}
            </div>

            {(output || errorMsg) && (
              <motion.div className="mt-4 card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ cursor: 'default' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: output ? 'var(--success)' : 'var(--error)' }}>{output ? '📤 Saída:' : '❌ Erro:'}</h3>
                {output && <pre className="font-mono text-sm">{output.join('\n')}</pre>}
                {errorMsg && <p className="text-sm" style={{ color: 'var(--error)' }}>{errorMsg}</p>}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <FeedbackModal show={feedback.show} correct={feedback.correct} xpGained={feedback.xp} bonuses={feedback.bonuses} message={feedback.msg}
        onNext={handleNext} nextLabel={idx < allExercicios.length - 1 ? 'Próximo' : '🏆 Finalizar'} />
    </div>
  );
}
