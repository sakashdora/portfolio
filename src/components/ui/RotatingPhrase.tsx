import { useEffect, useState } from 'react';

const phrases = [
  'scalable full-stack applications',
  'AI-powered products',
  'reliable backend systems',
  'interfaces people enjoy',
];

/** "I build ..." with a phrase that swaps every few seconds. Screen readers get the full sentence once. */
export const RotatingPhrase = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % phrases.length), 2800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="hero-lede">
      <span className="sr-only">I build scalable full-stack applications, AI-powered products and reliable backend systems.</span>
      <span aria-hidden="true" className="hero-lede-lead">I build</span>
      <span aria-hidden="true" className="hero-rotator"><span key={index} className="hero-rotator-word">{phrases[index]}</span></span>
    </p>
  );
};
