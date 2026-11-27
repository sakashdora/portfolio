import { ArrowUpRight, ArrowUp, Download } from 'lucide-react';
import { social } from '../../data/social';

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export const Footer = () => (
  <footer className="portfolio-footer">
    <div className="footer-inner">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#home" className="footer-wordmark">Akash<span>.</span></a>
          <p>Thoughtful code. Useful experiences.<br />Made with curiosity, in Bhubaneswar.</p>
        </div>
        <nav className="footer-column" aria-label="Footer">
          <span className="footer-heading">Explore</span>
          {footerLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="footer-column">
          <span className="footer-heading">Elsewhere</span>
          {social.map(item => (
            <a key={item.name} href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {item.name}<ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} S Akash Dora</span>
        <div className="footer-actions">
          <a href="/S_Akash_Dora_Resume.pdf" download><Download size={14} />Résumé</a>
          <a href="#home">Back to top<ArrowUp size={14} /></a>
        </div>
      </div>
    </div>
  </footer>
);
