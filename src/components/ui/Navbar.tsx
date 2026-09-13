import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Download, Home, User, Cpu, Briefcase, Compass, Send } from 'lucide-react';

const navItems = [
  { name: 'Home', id: 'home', icon: Home },
  { name: 'About', id: 'about', icon: User },
  { name: 'Skills', id: 'skills', icon: Cpu },
  { name: 'Projects', id: 'projects', icon: Briefcase },
  { name: 'Journey', id: 'journey', icon: Compass },
  { name: 'Contact', id: 'contact', icon: Send },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sectionIds = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActive(navItems[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (name: string) => {
    setActive(name);
    const element = document.getElementById(name.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Top Minimal Header (Brand + Resume Action) */}
      <header
        className={cn(
          "fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-md md:hidden flex items-center justify-between px-3.5 py-2 rounded-full transition-all duration-300",
          "bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(22,119,255,0.08)]",
          scrolled ? "shadow-md bg-white/90" : ""
        )}
      >
        <button 
          onClick={() => scrollTo('Home')}
          className="flex items-center gap-2 cursor-pointer text-left"
          aria-label="Scroll to Top"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1677FF] to-[#2F8CFF] flex items-center justify-center text-white font-black text-xs shadow-[0_2px_8px_rgba(22,119,255,0.35)]">
            AK
          </div>
          <div>
            <span className="font-black text-[#10254D] text-sm tracking-tight block leading-none">Akash.</span>
            <span className="text-[8px] text-[#16B98A] font-bold tracking-wider block leading-tight">PORTFOLIO</span>
          </div>
        </button>

        <a
          href="/S_Akash_Dora_Resume.pdf"
          download="S_Akash_Dora_Resume.pdf"
          className="flex items-center gap-1.5 bg-[#10254D] hover:bg-[#1677FF] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
          aria-label="Download Resume"
        >
          <span>Resume</span>
          <Download className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Mobile Instagram-Style Floating Bottom Nav Bar */}
      <nav
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-20px)] max-w-md md:hidden flex items-center justify-around px-1.5 py-1.5 rounded-full bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(22,119,255,0.22)]"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;

          return (
            <button
              key={item.name}
              onClick={() => scrollTo(item.name)}
              className={cn(
                "relative flex flex-col items-center justify-center py-1.5 px-1.5 rounded-2xl transition-all duration-300 flex-1 min-w-0 cursor-pointer min-h-[44px]",
                isActive ? "text-[#1677FF]" : "text-[#58708F]/75 hover:text-[#10254D] active:scale-90"
              )}
              aria-label={item.name}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabPill"
                  className="absolute inset-0 bg-[#1677FF]/10 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <div className={cn("relative transition-transform duration-200", isActive && "scale-110 -translate-y-0.5")}>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn("text-[9px] tracking-tight transition-all duration-200 truncate mt-0.5", isActive ? "font-bold text-[#1677FF]" : "font-medium text-[#58708F]/80")}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabDot"
                  className="w-1 h-1 rounded-full bg-[#1677FF] shadow-[0_0_6px_rgba(22,119,255,0.8)] mt-0.5"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop Top Floating Pill Navigation */}
      <nav
        className={cn(
          "hidden md:flex fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out items-center justify-between p-2 rounded-full bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(22,119,255,0.12)] hover:bg-white/90",
          scrolled ? "top-4 w-[90%] max-w-4xl shadow-md" : "top-6 w-[95%] max-w-5xl"
        )}
      >
        <button 
          onClick={() => scrollTo('Home')}
          className="flex items-center gap-2.5 pl-2 pr-6 cursor-pointer text-left"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1677FF] to-[#2F8CFF] flex items-center justify-center text-white font-black text-sm shadow-[0_4px_12px_rgba(22,119,255,0.35)]">
            AK
          </div>
          <div>
            <span className="font-black text-[#10254D] text-lg tracking-tight block leading-none">Akash.</span>
          </div>
        </button>
        
        <div className="flex-1 flex items-center justify-center gap-1">
          {navItems.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.name)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer",
                active === link.name
                  ? "bg-[#1677FF]/10 text-[#1677FF]"
                  : "text-[#10254D] hover:text-[#1677FF] hover:bg-black/5"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="flex flex-none pr-2">
          <a
            href="/S_Akash_Dora_Resume.pdf"
            download="S_Akash_Dora_Resume.pdf"
            className="flex items-center gap-2 bg-[#10254D] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1677FF] transition-all shadow-[0_4px_12px_rgba(16,37,77,0.2)] hover:shadow-[0_4px_12px_rgba(22,119,255,0.3)] hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Resume</span>
            <Download className="w-4 h-4" />
          </a>
        </div>
      </nav>
    </>
  );
};
