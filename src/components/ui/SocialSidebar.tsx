import { Github, Linkedin, Mail } from 'lucide-react';
import { social } from '../../data/social';

const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="lucide lucide-x-logo"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const icons: Record<string, React.ReactNode> = {
  github: <Github size={22} />,
  linkedin: <Linkedin size={22} />,
  twitter: <XIcon size={20} />,
  mail: <Mail size={22} />,
};

export const SocialSidebar = () => {
  return (
    <div className="hidden md:flex fixed left-6 top-[55%] -translate-y-1/2 flex-col items-center gap-6 z-40">
      {social.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#102A56] hover:text-[#1677FF] hover:-translate-y-1 transition-all duration-300 opacity-60 hover:opacity-100"
          aria-label={item.name}
        >
          {icons[item.icon]}
        </a>
      ))}
      <div className="w-[1px] h-24 bg-gradient-to-b from-[#102A56]/20 to-transparent mt-2" />
    </div>
  );
};
