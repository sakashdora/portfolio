import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { formatDuration, secondsUntil } from '../../lib/focusTimer';

export function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('One thing at a time.');
  const deadline = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (deadline.current === null) return;
      const next = secondsUntil(deadline.current);
      setRemaining(next);
      if (next === 0) {
        deadline.current = null;
        setRunning(false);
        setMessage('Session complete. Take a breath.');
      }
    };
    const interval = window.setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [running]);

  function reset(nextMinutes = minutes) {
    deadline.current = null;
    setRunning(false);
    setMinutes(nextMinutes);
    setRemaining(nextMinutes * 60);
    setMessage('One thing at a time.');
  }

  function toggle() {
    if (running) {
      const next = secondsUntil(deadline.current ?? Date.now());
      setRemaining(next);
      deadline.current = null;
      setRunning(false);
      setMessage(next ? 'Paused. Pick up when you’re ready.' : 'Session complete. Take a breath.');
    } else {
      const next = remaining || minutes * 60;
      deadline.current = Date.now() + next * 1000;
      setRemaining(next);
      setRunning(true);
      setMessage('A little space to focus.');
    }
  }

  return (
    <article className="dash-widget focus-widget">
      <div className="widget-heading"><span><Timer size={16} /> Focus timer</span><span className="tiny-label">YOUR SPACE</span></div>
      <div className="focus-presets" aria-label="Focus duration">
        {[15, 25, 50].map(value => <button key={value} type="button" aria-pressed={minutes === value} onClick={() => reset(value)}>{value} min</button>)}
      </div>
      <div className="focus-display" role="timer" aria-label={`${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`}>{formatDuration(remaining)}</div>
      <div className="focus-progress" role="progressbar" aria-label="Focus session progress" aria-valuemin={0} aria-valuemax={minutes * 60} aria-valuenow={minutes * 60 - remaining}><span style={{ transform: `scaleX(${1 - remaining / (minutes * 60)})` }} /></div>
      <div className="focus-actions"><button type="button" className="studio-button dark-button" onClick={toggle}>{running ? <Pause size={14} /> : <Play size={14} />}{running ? 'Pause' : remaining < minutes * 60 && remaining > 0 ? 'Resume' : 'Start focus'}</button><button type="button" className="round-control" onClick={() => reset()} aria-label="Reset focus timer"><RotateCcw size={16} /></button></div>
      <p className="widget-note" role="status">{message}</p>
    </article>
  );
}
