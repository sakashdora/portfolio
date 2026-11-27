import { useEffect, useState } from 'react';
import { scrollToId } from '../../lib/animations';

const items = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

/** A slim progress rail on the right edge showing where you are on the page. */
export const SectionDots = () => {
  const [active, setActive] = useState('home');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(items[items.length - 1].id);
        return;
      }
      const marker = window.scrollY + window.innerHeight * 0.4;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= marker) { setActive(items[i].id); return; }
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="section-dots" aria-label="Page sections">
      {items.map(item => (
        <button key={item.id} type="button" aria-label={item.label} aria-current={active === item.id ? 'true' : undefined} onClick={() => scrollToId(item.id)}>
          <span className="dot-label">{item.label}</span>
          <span className="dot" />
        </button>
      ))}
    </nav>
  );
};
