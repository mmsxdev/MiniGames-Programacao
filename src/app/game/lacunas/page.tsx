'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Lightbulb } from 'lucide-react';
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
  const [allExercicios, setAllExercicios] = useState<ExercicioLacuna[]>(exerciciosLacunas);
  const timer = useTimer();

  const ex = allExercicios[idx];

  const handleBuyHint = (lacunaId: string) => {
    if (hintsBought.has(lacunaId)) return;
    if (comprarDicaLocal(20)) {
      setHintsBought(prev => new Set(prev).add(lacunaId));
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
    carregarLacunasCustom().then(custom => {
      if (custom.length > 0) {
        setAllExercicios([...exerciciosLacunas, ...custom]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (lacunaId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [lacunaId]: value }));
    setErrors(prev => { const n = new Set(prev); n.delete(lacunaId); return n; });
    playPop();
  };

  const handleRun = () => {
    setAttempts(prev => prev + 1);
    // Check individual answers
    const wrongIds = new Set<string>();
    for (const lac of ex.lacunas) {
      const userVal = (answers[lac.id] || '').trim();
      const correctVal = ex.respostasCorretas[lac.id];
      if (userVal.toLowerCase() !== correctVal.toLowerCase()) wrongIds.add(lac.id);
    }
    setErrors(wrongIds);

    // Build code
    let code = ex.codigoTemplate;
    for (const lac of ex.lacunas) {
      code = code.replace(`__${lac.id}__`, answers[lac.id] || '');
    }

    const result = executarPortugol(code, ex.entradaSimulada);
    if (!result.sucesso) {
      setOutput(null);
      setErrorMsg(result.erro?.mensagem || 'Erro na execução');
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
      setFeedback({ show: true, correct: true, xp, bonuses, msg: `Saída: ${saidaStr}` });
    } else {
      playError();
      setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
      if (wrongIds.size > 0) setErrorMsg(`Há ${wrongIds.size} lacuna(s) incorreta(s). Verifique os campos em vermelho.`);
      else setErrorMsg(`Saída incorreta. Esperado: "${esperado}", obtido: "${saidaStr}"`);
    }
  };

  const handleNext = () => {
    setFeedback({ show: false, correct: false, xp: 0, bonuses: [], msg: '' });
    setAnswers({});
    setAttempts(0);
    setErrors(new Set());
    setHintsBought(new Set());
    setOutput(null);
    setErrorMsg('');
    if (idx < allExercicios.length - 1) {
      setIdx(idx + 1);
    } else {
      timer.stop();
      salvarResultado('lacunas', {
        completadoEm: new Date().toISOString(),
        xpGanho: totalXP,
        tentativas: attempts,
        acertos,
        totalQuestoes: allExercicios.length,
        tempoSegundos: timer.seconds,
      });
      if (acertos === allExercicios.length) adicionarBadge('⭐ Perfeição');
      router.push('/menu');
    }
  };

  const renderCode = useCallback(() => {
    const parts = ex.codigoTemplate.split(/__([A-Z_0-9]+)__/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const lacuna = ex.lacunas.find(l => l.id === part);
        if (!lacuna) return <span key={i}>{part}</span>;
        const hasError = errors.has(part);
        return (
          <input key={i} className={`input-code ${hasError ? 'error' : answers[part] ? 'filled' : ''}`}
            style={{ width: `calc(${Math.max(lacuna.tamanhoVisual, 4)}ch + 16px)` }}
            placeholder={`...`} value={answers[part] || ''}
            onChange={e => handleChange(part, e.target.value)}
            title={lacuna.dica} />
        );
      }
      return <span key={i}>{part}</span>;
    });
  }, [ex, answers, errors]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <button className="btn btn-secondary btn-sm" onClick={() => router.push('/menu')}><ArrowLeft size={16} /> Menu</button>
        <div className="flex items-center gap-3">
          <Timer running={timer.running} />
          <span className="badge badge-primary">Exercício {idx + 1}/{exerciciosLacunas.length}</span>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-8">
        <ScoreBar xp={totalXP} maxXP={500} label="XP Acumulado" />

        <AnimatePresence mode="wait">
          <motion.div key={ex.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="mt-6 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{ex.titulo}</h2>
                <span className={`badge ${ex.dificuldade === 'facil' ? 'badge-success' : ex.dificuldade === 'medio' ? 'badge-warning' : 'badge-error'}`}>{ex.dificuldade}</span>
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
                    {!isBought ? (
                      <button className="btn btn-secondary text-[10px] px-2 py-0 ml-1 rounded h-5" onClick={() => handleBuyHint(l.id)}>
                        Revelar Primeira Letra (-20 XP)
                      </button>
                    ) : (
                      <span className="badge badge-warning text-[10px] ml-1 py-0 h-5 flex items-center">Começa com &quot;{correta.charAt(0)}&quot;</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button className="btn btn-primary" onClick={handleRun}><Play size={18} /> Executar</button>
              {attempts > 0 && <span className="badge badge-warning self-center">Tentativa {attempts}</span>}
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
          </motion.div>
        </AnimatePresence>
      </main>

      <FeedbackModal show={feedback.show} correct={feedback.correct} xpGained={feedback.xp} bonuses={feedback.bonuses} message={feedback.msg}
        onNext={handleNext} nextLabel={idx < exerciciosLacunas.length - 1 ? 'Próximo Exercício' : '🏆 Finalizar'} />
    </div>
  );
}
