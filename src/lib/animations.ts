import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Smoothly scroll to a section id, using Lenis when it is running. */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'home' ? 0 : -8, duration: 1.3 });
  else el.scrollIntoView({ behavior: 'smooth' });
};

/** Smoothly scroll to an absolute Y position. */
export const scrollToY = (y: number, duration = 1.4) => {
  if (lenis) lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: 'smooth' });
};

/** Pause / resume smooth scrolling (used while a modal is open). */
export const setScrollLocked = (locked: boolean) => {
  if (!lenis) return;
  if (locked) lenis.stop(); else lenis.start();
};

const REVEAL_SELECTOR = [
  '.studio-section-label',
  '.section-intro',
  '.about-head',
  '.about-portrait',
  '.about-card',
  '.toolkit-shell',
  '.journey-intro',
  '.journey-entry',
  '.certification-strip',
  '.contact-shell',
  '.footer-main',
].join(',');

export const useAnimations = () => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Smooth scrolling -------------------------------------------------
    if (!reduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        anchors: { offset: -8 },
      });
      lenis.on('scroll', ScrollTrigger.update);
    }
    const updateLenis = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // ---- Scroll reveals ---------------------------------------------------
    let observer: IntersectionObserver | null = null;
    if (!reduced && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.setProperty('--reveal-delay', `${(i % 3) * 70}ms`);
        observer!.observe(el);
      });
    }

    // ---- Timeline line that draws itself as you scroll ----------------------
    const timeline = document.querySelector<HTMLElement>('.journey-entries');
    const lineTrigger = timeline && !reduced
      ? ScrollTrigger.create({
          trigger: timeline,
          start: 'top 65%',
          end: 'bottom 55%',
          onUpdate: (self) => timeline.style.setProperty('--p', String(self.progress)),
        })
      : null;
    if (timeline && reduced) timeline.style.setProperty('--p', '1');

    return () => {
      lineTrigger?.kill();
      observer?.disconnect();
      gsap.ticker.remove(updateLenis);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
};
