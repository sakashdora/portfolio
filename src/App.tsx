import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/ui/Hero';
import { About } from './components/ui/About';
import { Skills } from './components/ui/Skills';
import { Projects } from './components/ui/Projects';
import { Journey } from './components/ui/Journey';
import { Contact } from './components/ui/Contact';
import { Footer } from './components/ui/Footer';
import { SocialSidebar } from './components/ui/SocialSidebar';
import { SectionDots } from './components/ui/SectionDots';
import { CommandPalette } from './components/ui/CommandPalette';
import { LikeButton } from './components/ui/LikeButton';
import { StatsStrip } from './components/ui/StatsStrip';
import { ScrollMarquee } from './components/ui/ScrollMarquee';
const ChatBot = lazy(() => import('./components/ui/ChatBot').then(m => ({ default: m.ChatBot })));
import { useAnimations } from './lib/animations';

// Updates a transform directly instead of re-rendering React on every scroll.
const ScrollProgressBar = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, window.scrollY / total) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
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

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
};

export default function App() {
  useAnimations();

  return (
    <main className="relative min-h-screen w-full max-w-[100vw] overflow-x-clip">
      <a className="skip-link" href="#about">Skip to content</a>
      <ScrollProgressBar />

      <Navbar />
      <SocialSidebar />
      <SectionDots />
      <CommandPalette />

      <div className="relative z-10 w-full">
        <Hero />
        <div className="portfolio-content">
          <StatsStrip />
          <About />
          <Projects />
          <ScrollMarquee />
          <Skills />
          <Journey />
          <Contact />
        </div>
      </div>

      <Footer />
      <LikeButton />
      <Suspense fallback={null}><ChatBot /></Suspense>
    </main>
  );
}
