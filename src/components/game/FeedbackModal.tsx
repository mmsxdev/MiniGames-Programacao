'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Zap, Star } from 'lucide-react';

interface FeedbackModalProps {
  show: boolean;
  correct: boolean;
  xpGained: number;
  message?: string;
  bonuses?: string[];
  onNext: () => void;
  nextLabel?: string;
}

export function FeedbackModal({ show, correct, xpGained, message, bonuses = [], onNext, nextLabel = 'Próximo' }: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}>
            <div className="mb-4">
              {correct ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                  <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto' }} />
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                  <XCircle size={64} style={{ color: 'var(--error)', margin: '0 auto' }} />
                </motion.div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{correct ? '✅ Correto!' : '❌ Não foi dessa vez!'}</h2>
            {message && <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>{message}</p>}
            <motion.div className="text-3xl font-bold mb-4" style={{ color: correct ? 'var(--success)' : 'var(--error)' }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              +{xpGained} XP
            </motion.div>
            {bonuses.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {bonuses.map((b, i) => (
                  <motion.div key={i} className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--warning)' }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                    {i === 0 ? <Star size={16} /> : <Zap size={16} />} {b}
                  </motion.div>
                ))}
              </div>
            )}
            <button className="btn btn-primary btn-lg w-full" onClick={onNext}>{nextLabel}</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
