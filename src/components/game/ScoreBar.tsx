'use client';
import { motion } from 'framer-motion';

export function ScoreBar({ xp, maxXP, label }: { xp: number; maxXP: number; label?: string }) {
  const pct = Math.min(100, (xp / maxXP) * 100);
  return (
    <div className="w-full">
      {label && <div className="flex justify-between mb-1 text-sm"><span style={{ color: 'var(--text-secondary)' }}>{label}</span><span style={{ color: 'var(--primary-light)' }} className="font-bold">{xp} XP</span></div>}
      <div className="xp-bar">
        <motion.div className="xp-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </div>
    </div>
  );
}
