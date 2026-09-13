import { social } from '../../data/social';

export const Footer = () => {
  return (
    <footer className="relative pt-8 sm:pt-12 pb-28 md:pb-12 z-10 border-t border-white/20 mt-12 md:mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="font-bold text-[#10254D] text-lg sm:text-xl tracking-tight mb-1">Akash.</div>
          <div className="text-[#58708F] text-xs sm:text-sm">Full-Stack Software Engineer</div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {social.map(s => (
            <a 
              key={s.name} 
              href={s.url}
              className="text-[#58708F] hover:text-[#1677FF] text-xs sm:text-sm font-medium transition-colors py-1"
            >
              {s.name}
            </a>
          ))}
        </div>
        
        <div className="text-[#58708F]/70 text-xs sm:text-sm text-center md:text-right">
          © {new Date().getFullYear()} S Akash Dora. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
