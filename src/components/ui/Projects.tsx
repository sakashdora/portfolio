import { projects } from '../../data/projects';
import { SectionTitle } from './SectionTitle';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const projectCards = container.querySelectorAll('.project-card');
    
    projectCards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      );
    });
  }, []);

  return (
    <section id="projects" className="relative min-h-screen py-16 md:py-32 z-10 overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={containerRef}>
        <SectionTitle title="Featured Projects" subtitle="A selection of my recent engineering work." />
        
        <div className="flex flex-col gap-12 md:gap-24 mt-10 md:mt-20">
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              className={`project-card flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full relative group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1677FF]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative glass-panel p-2 rounded-2xl transform transition-transform duration-700 group-hover:rotate-y-2 group-hover:rotate-x-2 shadow-lg hover:shadow-[0_20px_50px_rgba(22,119,255,0.15)]">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full aspect-video object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl pointer-events-none" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 sm:space-y-6 w-full">
                <div className="text-xs sm:text-sm font-bold text-[#1677FF] tracking-wider uppercase">Project 0{idx + 1}</div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#10254D]">{project.title}</h3>
                <p className="text-[#58708F] text-sm sm:text-base md:text-lg leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                  {project.tech.map(t => (
                    <span key={t} className="text-xs font-semibold text-[#10254D] bg-[#1677FF]/10 px-2.5 sm:px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-6">
                  <button className="flex items-center justify-center gap-2 bg-[#10254D] text-white px-6 py-3 sm:py-2.5 rounded-full text-sm font-medium hover:bg-[#1677FF] hover:-translate-y-0.5 hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer">
                    <ExternalLink size={16} /> Live Demo
                  </button>
                  <button className="flex items-center justify-center gap-2 glass-panel text-[#10254D] px-6 py-3 sm:py-2.5 rounded-full text-sm font-medium hover:bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all w-full sm:w-auto cursor-pointer">
                    <Github size={16} /> Source Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
