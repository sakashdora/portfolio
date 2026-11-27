import { useEffect, useRef } from 'react';

const words = ['Full-stack', 'AI-powered', 'Backend', 'Interfaces', 'Cloud', 'Curious'];

/** A big kinetic line of text that speeds up and reverses with your scrolling. */
export const ScrollMarquee = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const wrap = wrapRef.current;
    if (!row || !wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0;
    let direction = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let visible = true;
    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '200px' });
    observer.observe(wrap);

    const tick = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) > 0.5) direction = delta > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(delta), 60) - boost) * 0.12;
      if (visible) {
        const half = row.scrollWidth / 2;
        x += direction * (0.6 + boost * 0.55);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        row.style.transform = `translate3d(${x}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  const group = (suffix: string) => words.map((word, i) => (
    <span className="marquee-item" key={`${suffix}-${word}`}>
      <span className={i % 2 ? 'is-solid' : 'is-outline'}>{word}</span>
      <i aria-hidden="true">✦</i>
    </span>
  ));

  return (
    <div ref={wrapRef} className="scroll-marquee" aria-hidden="true">
      <div ref={rowRef} className="marquee-row">{group('a')}{group('b')}</div>
    </div>
  );
};
