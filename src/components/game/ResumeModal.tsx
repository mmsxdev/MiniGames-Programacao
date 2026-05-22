'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, RotateCcw } from 'lucide-react';

interface ResumeModalProps {
  show: boolean;
  minigame: string;
  questaoAtual: number;
  totalQuestoes: number;
  xpAcumulado: number;
  onContinue: () => void;
  onRestart: () => void;
}

const minigameNames: Record<string, string> = {
  lacunas: 'Código com Lacunas',
  quiz: 'Quiz de Programação',
  'quebra-cabeca': 'Quebra-Cabeça de Código',
};

export function ResumeModal({ show, minigame, questaoAtual, totalQuestoes, xpAcumulado, onContinue, onRestart }: ResumeModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="text-5xl mb-4 text-center">📋</div>
            <h2 className="text-2xl font-bold mb-2 text-center">Exercício em andamento!</h2>
            <p className="text-center mb-1" style={{ color: 'var(--text-secondary)' }}>
              {minigameNames[minigame] || minigame}
            </p>
            <p className="text-center mb-2" style={{ color: 'var(--text-secondary)' }}>
              Questão {questaoAtual + 1} de {totalQuestoes} — {xpAcumulado} XP acumulados
            </p>

            <div className="w-full rounded-full h-2 mb-6" style={{ background: 'var(--bg-secondary)' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${((questaoAtual + 1) / totalQuestoes) * 100}%`,
                  background: 'var(--primary)',
                }}
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2" onClick={onContinue}>
                <PlayCircle size={20} /> Continuar de onde parou
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center gap-2" onClick={onRestart}>
                <RotateCcw size={18} /> Começar do zero
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
