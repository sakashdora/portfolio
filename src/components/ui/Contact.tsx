import { Send } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    gsap.fromTo(form,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: form,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section id="contact" className="relative min-h-screen py-16 md:py-32 z-10 flex flex-col justify-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full text-center">
        <SectionTitle 
          title="Let's Build Something Great." 
          subtitle="Available for engineering opportunities." 
          className="mb-8 md:mb-12"
        />
        
        <div ref={formRef} className="glass-panel p-6 sm:p-8 md:p-12 rounded-3xl max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-[#1677FF]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <form className="relative z-10 flex flex-col gap-5 sm:gap-6 text-left">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#10254D] mb-1.5 sm:mb-2">Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/50 text-base text-[#10254D] placeholder-[#58708F]/50 transition-all shadow-sm focus:shadow-md min-h-[48px]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#10254D] mb-1.5 sm:mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/50 text-base text-[#10254D] placeholder-[#58708F]/50 transition-all shadow-sm focus:shadow-md min-h-[48px]"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#10254D] mb-1.5 sm:mb-2">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/50 text-base text-[#10254D] placeholder-[#58708F]/50 transition-all resize-none shadow-sm focus:shadow-md"
                placeholder="Tell me about your project..."
              />
            </div>
            <button 
              type="button"
              className="mt-2 bg-gradient-to-r from-[#1677FF] to-[#2F8CFF] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(22,119,255,0.3)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 w-full min-h-[48px] group"
            >
              Send Message <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
