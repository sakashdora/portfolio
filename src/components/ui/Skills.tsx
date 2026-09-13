import { skills } from '../../data/skills';
import { SectionTitle } from './SectionTitle';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.skill-card');
    
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section id="skills" className="relative min-h-screen py-16 md:py-32 z-10 flex flex-col justify-center overflow-hidden w-full max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <SectionTitle title="Technology Ecosystem" subtitle="The tools and frameworks I use to build scalable solutions." />
        
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-10 md:mt-16">
          {Object.entries(skills).map(([category, items], idx) => (
            <div key={category} className="skill-card glass-panel p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl group hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(22,119,255,0.12)] transition-all duration-500">
              <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
                <h3 className="text-xs sm:text-sm font-bold text-[#1677FF] uppercase tracking-widest">{category}</h3>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF] font-mono text-xs transition-colors group-hover:bg-[#1677FF] group-hover:text-white">
                  0{idx + 1}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {items.map(skill => (
                  <span 
                    key={skill}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/40 border border-white/50 text-[#10254D] text-xs sm:text-sm font-medium rounded-lg hover:bg-white hover:border-[#1677FF]/30 transition-colors cursor-default hover:shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
