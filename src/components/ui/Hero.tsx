import { BarChart3, Brain, Download, ArrowRight, Code } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { OrbitalSystem } from './OrbitalSystem';
import { TerminalModal } from './TerminalModal';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const fullName = "S Akash Dora";

  const [orbitConfig, setOrbitConfig] = useState({
    speed: 1.1,
    scale: 0.7,
    particles: 850,
    overlap: true,
    offsetX: 0,
    offsetY: 0.9
  });

  const heroSectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateOrbitPosition = () => {
      if (!portraitRef.current || !heroSectionRef.current) return;
      const portraitRect = portraitRef.current.getBoundingClientRect();
      const heroRect = heroSectionRef.current.getBoundingClientRect();
      
      const portraitCenterY = (portraitRect.top + portraitRect.height / 2) - heroRect.top;
      const heroHeight = heroRect.height || window.innerHeight;
      if (heroHeight <= 0) return;
      
      const r = portraitCenterY / heroHeight;
      // Camera position z=8, fov=45: visibleHeight = 2 * 8 * tan(22.5 deg) = ~6.6274
      const visibleHeight = 16 * Math.tan((45 * Math.PI) / 360);
      const calculatedOffsetY = (0.5 - r) * visibleHeight;
      
      setOrbitConfig(prev => {
        if (Math.abs(prev.offsetY - calculatedOffsetY) > 0.02) {
          return { ...prev, offsetY: Number(calculatedOffsetY.toFixed(3)) };
        }
        return prev;
      });
    };

    updateOrbitPosition();
    const timer = setTimeout(updateOrbitPosition, 100);
    window.addEventListener('resize', updateOrbitPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateOrbitPosition);
    };
  }, []);

  
  useEffect(() => {
    // Typewriter effect for main title
    let i = 0;
    const intervalId = setInterval(() => {
      setTypedName(fullName.slice(0, i + 1));
      i++;
      if (i >= fullName.length) {
        clearInterval(intervalId);
      }
    }, 150);

    const ctx = gsap.context(() => {
      // Initial Stagger Animation
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 }
        );
      }

      // Floating UI Elements Ambient Animation
      if (leftCardRef.current) {
        gsap.to(leftCardRef.current, {
          y: "-=12",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0
        });
      }

      if (rightCardRef.current) {
        gsap.to(rightCardRef.current, {
          y: "+=12",
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5
        });
      }

      // Scroll Fade & Dissolve Effect for Hero Elements (No transform collisions)
      if (heroSectionRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          }
        });

        if (contentRef.current) {
          heroTl.to(contentRef.current, { opacity: 0, ease: "power1.out" }, 0);
        }
        if (portraitRef.current) {
          heroTl.to(portraitRef.current, { opacity: 0.1, scale: 0.95, ease: "power1.out" }, 0);
        }
        if (leftCardRef.current) {
          heroTl.to(leftCardRef.current, { opacity: 0, ease: "power1.out" }, 0);
        }
        if (rightCardRef.current) {
          heroTl.to(rightCardRef.current, { opacity: 0, ease: "power1.out" }, 0);
        }
        if (scrollIndicatorRef.current) {
          heroTl.to(scrollIndicatorRef.current, { opacity: 0, ease: "power1.out" }, 0);
        }
      }
    });

    return () => {
      clearInterval(intervalId);
      ctx.revert();
    };
  }, []);

  const techs = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', desc: 'Component UI' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', desc: 'JS Runtime' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', desc: 'Relational DB' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', desc: 'Data & Backend' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', desc: 'Version Control' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', desc: 'Cloud Platform' }
  ];

  return (
    <>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 25s linear infinite;
      }
      .marquee-container:hover .animate-marquee {
        animation-play-state: paused;
      }
      @keyframes wheelScroll {
        0% { transform: translateY(0); opacity: 0; }
        25% { opacity: 1; }
        60% { transform: translateY(7px); opacity: 1; }
        100% { transform: translateY(11px); opacity: 0; }
      }
      .animate-wheel-scroll {
        animation: wheelScroll 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
      }
      @keyframes trackDrop {
        0% { transform: translateY(-100%); opacity: 0; }
        30% { opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translateY(200%); opacity: 0; }
      }
      .animate-track-drop {
        animation: trackDrop 1.8s ease-in-out infinite;
      }
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-7px); }
      }
      .animate-gentle-float {
        animation: gentleFloat 5s ease-in-out infinite;
      }
    `}</style>
    <section ref={heroSectionRef} id="home" className="relative min-h-[100svh] w-full max-w-full overflow-hidden flex flex-col pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6">
      
      {/* 3D WebGL Background - Fixed to background to prevent UI overlap */}
      <div className="absolute inset-0 pointer-events-auto z-0 transition-all duration-700">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <OrbitalSystem config={orbitConfig} />
        </Canvas>
      </div>
      
      {/* Atmospheric Background Glows (Non-3D) */}
      <div className="absolute top-1/3 left-1/4 w-[30vw] h-[30vw] bg-[#1677FF]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[25vw] h-[25vw] bg-[#6ED7FF]/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 flex-1 flex flex-col items-center justify-between pointer-events-none">
        
        {/* Main Content Wrapper - Vertically balanced, brought down into available space */}
        <div className="w-full flex flex-col items-center justify-center my-auto">
          {/* Profile & Floating Cards Group */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-[1000px] mb-3 sm:mb-5 perspective-1000">
            
            {/* Portrait Image */}
            <div ref={portraitRef} className="relative w-[clamp(130px,18vh,210px)] aspect-square z-20 pointer-events-auto animate-gentle-float">
              {/* Soft backdrop glow strictly behind the image */}
              <div className="absolute inset-0 bg-[#1677FF]/20 rounded-full blur-2xl pointer-events-none" />
              
              <img 
                src="/assets/profile_pic.png" 
                alt="S Akash Dora" 
                draggable={false}
                className="w-full h-full object-cover rounded-full shadow-[0_0_40px_rgba(22,119,255,0.2)] ring-1 ring-white/30 select-none pointer-events-none"
              />
              
              {/* Availability Badge */}
              <div className="absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#E6F8F3] border border-[#16B98A]/15 z-30 whitespace-nowrap shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16B98A]" />
                <span className="text-[9px] sm:text-[10px] font-bold text-[#16B98A]">Available for Roles</span>
              </div>
            </div>

            {/* Left Floating Card (Code) */}
            <div 
              ref={leftCardRef} 
              onClick={() => setIsTerminalOpen(true)}
              className="hidden lg:block absolute left-4 xl:-left-12 top-[10%] bg-white/80 backdrop-blur-md p-4 rounded-2xl w-[clamp(240px,20vw,320px)] transform -rotate-3 shadow-[0_8px_30px_rgba(22,119,255,0.1)] border border-[#1677FF]/10 z-30 pointer-events-auto cursor-pointer hover:scale-105 hover:bg-white transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <Code size={14} className="text-[#1677FF]" />
              </div>
              <pre className="text-[10px] xl:text-[11px] font-mono leading-relaxed pointer-events-none">
                <span className="text-[#1677FF] font-semibold">const</span> <span className="text-[#102A56]">developer</span> <span className="text-[#1677FF]">=</span> {'{'}
                {'\n'}  <span className="text-[#1677FF]">name:</span> <span className="text-[#0EA5E9]">"Akash"</span>,
                {'\n'}  <span className="text-[#1677FF]">role:</span> <span className="text-[#0EA5E9]">"Full-Stack Engineer"</span>,
                {'\n'}  <span className="text-[#1677FF]">passion:</span> <span className="text-[#0EA5E9]">"Building Scalable</span>
                {'\n'}           <span className="text-[#0EA5E9]">Solutions"</span>
                {'\n'}{'}'};
              </pre>
            </div>

            {/* Right Floating Cards */}
            <div ref={rightCardRef} className="hidden lg:flex absolute right-4 xl:-right-12 top-[10%] flex-col gap-4 z-30 pointer-events-auto">
              {/* Card 1 */}
              <div className="bg-white/90 backdrop-blur-md p-2.5 pr-4 rounded-xl flex items-center gap-3 w-[clamp(200px,18vw,260px)] shadow-[0_8px_30px_rgba(22,119,255,0.1)] border border-gray-100 transform rotate-2">
                <div className="w-8 h-8 rounded-lg bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF] shrink-0">
                  <BarChart3 size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[9px] text-[#536B8D] font-bold uppercase tracking-wider">Build</div>
                  <div className="text-[11px] xl:text-xs font-bold text-[#102A56]">Scalable Products</div>
                </div>
                <div className="text-[#102A56]/40">
                  <ArrowRight size={12} />
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white/90 backdrop-blur-md p-2.5 pr-4 rounded-xl flex items-center gap-3 w-[clamp(200px,18vw,260px)] shadow-[0_8px_30px_rgba(22,119,255,0.1)] border border-gray-100 transform -rotate-1 ml-4">
                <div className="w-8 h-8 rounded-lg bg-[#1677FF]/10 flex items-center justify-center text-[#1677FF] shrink-0">
                  <Brain size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[9px] text-[#536B8D] font-bold uppercase tracking-wider">Apply</div>
                  <div className="text-[11px] xl:text-xs font-bold text-[#102A56]">AI for Real World</div>
                </div>
                <div className="text-[#102A56]/40">
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
            
          </div>

          {/* Text Content */}
          <div ref={contentRef} className="text-center shrink-0 mb-3 sm:mb-4 pointer-events-auto relative w-full px-2">
            
            <h1 className="text-[clamp(28px,7.5vw,56px)] leading-[1.1] font-black text-[#102A56] mb-1.5 tracking-tight drop-shadow-sm min-h-[1.2em]">
              {typedName.length <= 2 ? (
                <>{typedName}</>
              ) : (
                <>
                  {typedName.slice(0, 2)}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] to-[#6ED7FF]">
                    {typedName.slice(2, 7)}
                  </span>
                  {typedName.slice(7)}
                </>
              )}
            </h1>
            <h2 className="text-[clamp(15px,4vw,22px)] font-bold text-[#102A56] mb-2 tracking-wide">
              Full-Stack Software Engineer
            </h2>
            <p className="text-[#536B8D] text-[clamp(12px,3.5vw,15px)] max-w-[540px] mx-auto mb-5 font-medium leading-relaxed px-2">
              I build scalable full-stack applications, AI-powered products,
              and reliable backend systems.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5 w-full max-w-xs sm:max-w-none mx-auto">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#1677FF] text-white px-6 py-3 sm:py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#102A56] hover:shadow-[0_8px_24px_rgba(22,119,255,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all w-full sm:w-[170px] cursor-pointer"
              >
                View Projects <ArrowRight size={14} strokeWidth={2.5} />
              </button>
              <a 
                href="/S_Akash_Dora_Resume.pdf"
                download="S_Akash_Dora_Resume.pdf"
                className="bg-transparent border border-[#102A56]/20 text-[#102A56] px-6 py-3 sm:py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/60 hover:border-[#1677FF]/40 hover:text-[#1677FF] hover:-translate-y-0.5 active:scale-[0.98] transition-all w-full sm:w-[170px] cursor-pointer"
              >
                <Download size={14} strokeWidth={2.5} /> Download Resume
              </a>
            </div>

            {/* Tech Stack Strip (Liquid Marquee) */}
            <div className="marquee-container overflow-hidden w-[calc(100vw-32px)] max-w-[650px] bg-white/75 backdrop-blur-xl border border-white rounded-full shadow-[0_4px_24px_rgba(16,37,77,0.06)] mx-auto relative cursor-pointer group">
              {/* Fading edges for smooth entry/exit */}
              <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 rounded-l-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 rounded-r-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex w-max animate-marquee">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-3 sm:gap-6 px-2 sm:px-3 py-2 sm:py-2.5 items-center">
                    {techs.map((tech) => (
                      <div 
                        key={`${i}-${tech.name}`} 
                        className="flex items-center gap-1.5 text-[11px] sm:text-sm font-bold text-[#536B8D] hover:text-[#1677FF] transition-all duration-300 whitespace-nowrap cursor-pointer px-1.5 sm:px-2"
                        onClick={() => setActiveTech(activeTech === tech.name ? null : tech.name)}
                      >
                        <img src={tech.icon} alt={tech.name} className="w-3.5 h-3.5 sm:w-5 sm:h-5 object-contain" />
                        <span>{tech.name}</span>
                        <div className={`overflow-hidden transition-all duration-300 flex items-center ${activeTech === tech.name ? 'max-w-[150px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'}`}>
                          <span className="text-[9px] sm:text-xs font-semibold text-white bg-[#1677FF] px-2 py-0.5 rounded-full whitespace-nowrap">
                            {tech.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <button 
          ref={scrollIndicatorRef}
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex flex-col items-center gap-1.5 sm:gap-2 opacity-60 hover:opacity-100 transition-all duration-300 shrink-0 pointer-events-auto cursor-pointer pb-2 hover:-translate-y-0.5 mt-2"
          aria-label="Scroll down to About section"
        >
          {/* Animated Mouse Capsule with Rolling Wheel */}
          <div className="w-4.5 h-7 sm:w-5 sm:h-8 rounded-full border-2 border-[#102A56]/40 group-hover:border-[#1677FF] flex justify-center p-0.5 sm:p-1 transition-colors bg-white/40 backdrop-blur-xs">
            <div className="w-1 h-1.5 sm:h-2 rounded-full bg-[#1677FF] animate-wheel-scroll shadow-[0_0_8px_rgba(22,119,255,0.7)]" />
          </div>

          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] text-[#102A56] group-hover:text-[#1677FF] transition-colors">
            SCROLL
          </span>

          {/* Flowing Gradient Track */}
          <div className="relative w-[1.5px] h-5 sm:h-6 bg-[#102A56]/15 group-hover:bg-[#1677FF]/30 rounded-full overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#1677FF] to-transparent animate-track-drop" />
          </div>
        </button>
      </div>

      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </section>
    </>
  );
};
