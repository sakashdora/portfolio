import { SectionTitle } from './SectionTitle';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftPanel = leftPanelRef.current;
    const list = listRef.current;
    
    if (!section || !leftPanel || !list) return;

    gsap.fromTo(leftPanel, 
      { x: -50, opacity: 0 },
      { 
        x: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        }
      }
    );

    gsap.fromTo(list.children, 
      { x: 50, opacity: 0 },
      { 
        x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        }
      }
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative min-h-screen py-16 md:py-32 z-10 overflow-hidden w-full max-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle title="About Me" subtitle="A brief look into my background and philosophy." />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-8 md:mt-12">
          <div ref={leftPanelRef} className="glass-panel p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1677FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#10254D] mb-4 sm:mb-6">Engineering Philosophy</h3>
            <p className="text-[#58708F] text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              I believe in building software that is not only functional but resilient, scalable, and intuitive. My approach blends rigorous architectural planning with an eye for elegant user experiences.
            </p>
            <p className="text-[#58708F] text-sm sm:text-base leading-relaxed">
              Whether it's orchestrating a distributed microservice architecture or fine-tuning a React render cycle, I strive for clean code, comprehensive testing, and pragmatic solutions.
            </p>
          </div>

          <div ref={listRef} className="flex flex-col gap-4 sm:gap-6">
            <div className="glass-panel p-5 sm:p-6 rounded-2xl flex gap-4 sm:gap-6 hover:shadow-[0_8px_30px_rgba(22,119,255,0.12)] transition-shadow hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#16B98A]/10 flex items-center justify-center flex-shrink-0 text-[#16B98A] font-bold text-sm sm:text-base">
                01
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-[#10254D] mb-1.5 sm:mb-2">Frontend Excellence</h4>
                <p className="text-[#58708F] text-xs sm:text-sm leading-relaxed">Crafting responsive, accessible, and performant user interfaces using React, Next.js, and modern CSS strategies.</p>
              </div>
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-2xl flex gap-4 sm:gap-6 hover:shadow-[0_8px_30px_rgba(22,119,255,0.12)] transition-shadow hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1677FF]/10 flex items-center justify-center flex-shrink-0 text-[#1677FF] font-bold text-sm sm:text-base">
                02
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-[#10254D] mb-1.5 sm:mb-2">Backend Scalability</h4>
                <p className="text-[#58708F] text-xs sm:text-sm leading-relaxed">Designing robust APIs and microservices using Node.js, Python, and PostgreSQL, ensuring high availability.</p>
              </div>
            </div>

            <div className="glass-panel p-5 sm:p-6 rounded-2xl flex gap-4 sm:gap-6 hover:shadow-[0_8px_30px_rgba(22,119,255,0.12)] transition-shadow hover:-translate-y-1 duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2F8CFF]/10 flex items-center justify-center flex-shrink-0 text-[#2F8CFF] font-bold text-sm sm:text-base">
                03
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-[#10254D] mb-1.5 sm:mb-2">AI Integration</h4>
                <p className="text-[#58708F] text-xs sm:text-sm leading-relaxed">Implementing machine learning models and LLMs to solve real-world problems and enhance product capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
