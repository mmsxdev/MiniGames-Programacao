'use client';
import { motion } from 'framer-motion';
import type { QuestionStatus } from '@/lib/progress';

interface QuestionNavProps {
  total: number;
  current: number;
  statuses: QuestionStatus[];
  onNavigate: (index: number) => void;
}

const statusConfig: Record<QuestionStatus, { bg: string; border: string; text: string; label: string }> = {
  'not-visited':     { bg: 'var(--bg-secondary)',  border: 'var(--bg-secondary)',  text: 'var(--text-muted)',    label: 'Não visitada' },
  'current':         { bg: 'var(--primary)',        border: 'var(--primary-light)', text: '#fff',                 label: 'Atual' },
  'answered-correct':{ bg: 'var(--success)',         border: 'var(--success)',       text: '#fff',                 label: 'Correta' },
  'answered-wrong':  { bg: 'var(--error)',           border: 'var(--error)',         text: '#fff',                 label: 'Errada' },
  'skipped':         { bg: '#f59e0b',               border: '#f59e0b',             text: '#fff',                 label: 'Pulada' },
};

const statusIcons: Record<QuestionStatus, string> = {
  'not-visited': '',
  'current': '',
  'answered-correct': '✓',
  'answered-wrong': '✗',
  'skipped': '⏭',
};

export function QuestionNav({ total, current, statuses, onNavigate }: QuestionNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-3 px-2">
      {Array.from({ length: total }, (_, i) => {
        const status = statuses[i] || (i === current ? 'current' : 'not-visited');
        const config = statusConfig[status];
        const icon = statusIcons[status];
        const isCurrent = i === current;

        return (
          <motion.button
            key={i}
            className="relative flex items-center justify-center rounded-full font-bold text-xs transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              width: 36,
              height: 36,
              background: config.bg,
              border: `2px solid ${config.border}`,
              color: config.text,
              cursor: 'pointer',
              boxShadow: isCurrent ? `0 0 0 3px ${config.border}40` : 'none',
            }}
            onClick={() => onNavigate(i)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title={`Questão ${i + 1} — ${config.label}`}
            animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={isCurrent ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
          >
            {icon || (i + 1)}
          </motion.button>
        );
      })}
    </div>
  );
}
