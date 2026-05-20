'use client';
import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

export function Timer({ running, onTick }: { running: boolean; onTick?: (s: number) => void }) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSeconds(s => { const next = s + 1; onTick?.(next); return next; });
      }, 1000);
    } else { clearInterval(ref.current); }
    return () => clearInterval(ref.current);
  }, [running, onTick]);

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className="flex items-center gap-2 badge badge-primary">
      <Clock size={14} />
      <span className="font-mono font-bold text-sm">{String(min).padStart(2,'0')}:{String(sec).padStart(2,'0')}</span>
    </div>
  );
}

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (running) { ref.current = setInterval(() => setSeconds(s => s + 1), 1000); }
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [running]);

  return { seconds, running, start: () => setRunning(true), stop: () => setRunning(false), reset: () => { setSeconds(0); setRunning(false); } };
}
