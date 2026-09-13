import { useState, useEffect } from 'react';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/ui/Hero';
import { About } from './components/ui/About';
import { Skills } from './components/ui/Skills';
import { Projects } from './components/ui/Projects';
import { Journey } from './components/ui/Journey';
import { Contact } from './components/ui/Contact';
import { Footer } from './components/ui/Footer';
import { SocialSidebar } from './components/ui/SocialSidebar';
import { CustomCursor } from './components/ui/CustomCursor';
import { Scene } from './components/3d/Scene';
import { useAnimations } from './lib/animations';

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#1677FF] via-[#6ED7FF] to-[#16B98A] z-[100] transition-all duration-75 shadow-[0_0_12px_rgba(22,119,255,0.8)] pointer-events-none"
      style={{ width: `${progress}%` }}
    />
  );
};

export default function App() {
  useAnimations();

  return (
    <main className="relative min-h-screen bg-transparent md:cursor-none w-full max-w-[100vw] overflow-x-hidden">
      <ScrollProgressBar />
      <CustomCursor />
      
      {/* 3D Background */}
        <Scene />
      
      {/* UI Overlay */}
        <Navbar />
        <SocialSidebar />
        
        <div className="relative z-10 w-full pb-20">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Contact />
        </div>
        
        <Footer />
    </main>
  );
}
