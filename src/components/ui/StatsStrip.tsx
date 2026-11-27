import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { projects } from '../../data/projects';
import { skills } from '../../data/skills';
import { profile } from '../../data/profile';

const toolCount = Object.values(skills).reduce((total, list) => total + list.length, 0);

const stats = [
  { value: projects.length, label: 'Projects built', note: 'Web, AI and full stack' },
  { value: toolCount, label: 'Tools in the kit', note: 'From React to Postgres' },
  { value: 90, label: 'Day internship', note: 'Shipping to production' },
  { value: profile.certifications.length, label: 'Certifications', note: 'Data and AI' },
];

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      el.textContent = String(to);
      return;
    }
    const counter = { value: 0 };
    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      tween = gsap.to(counter, {
        value: to,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = String(Math.round(counter.value)); },
      });
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => { observer.disconnect(); tween?.kill(); };
  }, [to]);

  return <span ref={ref}>0</span>;
}

export const StatsStrip = () => (
  <section className="portfolio-section stats-section" aria-label="At a glance">
    <div className="stats-grid">
      {stats.map(stat => (
        <div className="stat-cell" key={stat.label}>
          <strong><CountUp to={stat.value} /></strong>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-note">{stat.note}</span>
        </div>
      ))}
    </div>
  </section>
);
