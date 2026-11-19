import { ArrowUpRight, ArrowUp } from 'lucide-react';

export const Footer = () => (
  <footer className="portfolio-footer"><div className="footer-main"><a href="#home" className="footer-wordmark">Akash<span>.</span></a><p>Thoughtful code.<br />Useful experiences.</p><a className="footer-top" href="#home">Back to top<ArrowUp size={17} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} S Akash Dora</span><span>Made with curiosity, in Bhubaneswar.</span><a href="/S_Akash_Dora_Resume.pdf" download>Download résumé<ArrowUpRight size={14} /></a></div></footer>
);
