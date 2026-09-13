import { journey } from '../../data/journey';
import { SectionTitle } from './SectionTitle';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Journey = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const items = container.querySelectorAll('.journey-item');
    
    // Animate the center line drawing down
    gsap.fromTo(line, 
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "bottom 75%",
          scrub: 1
        }
      }
    );

    // Stagger the items fading in
    items.forEach((item, i) => {
      gsap.fromTo(item,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          }
        }
      );
    });
  }, []);

  return (
    <section id="journey" className="relative min-h-screen py-16 md:py-32 z-10 flex flex-col justify-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative">
        <SectionTitle title="The Journey" subtitle="Key milestones in my engineering career." />
        
        <div ref={containerRef} className="relative mt-12 md:mt-20">
          {/* Central / Left Line */}
          <div ref={lineRef} className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#1677FF]/30 to-transparent -translate-x-1/2" />
          
          <div className="flex flex-col gap-8 md:gap-12">
            {journey.map((item, idx) => (
              <div 
                key={idx} 
                className={`journey-item relative flex items-start md:items-center justify-between w-full pl-10 sm:pl-14 md:pl-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-5/12" />
                
                {/* Milestone Node */}
                <div className="absolute left-4 sm:left-6 md:left-1/2 top-4 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-panel flex items-center justify-center shadow-[0_0_15px_rgba(22,119,255,0.4)] z-10">
                  <div className="w-2 h-2 rounded-full bg-[#1677FF]" />
                </div>

                {/* Content Panel */}
                <div className="w-full md:w-5/12 glass-panel p-5 sm:p-6 rounded-2xl group hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(22,119,255,0.12)] transition-all duration-300">
                  <div className="text-xs sm:text-sm font-bold text-[#1677FF] mb-1.5">{item.year}</div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#10254D] mb-2 sm:mb-3">{item.title}</h4>
                  <p className="text-[#58708F] text-xs sm:text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
