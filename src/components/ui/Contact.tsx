import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Copy, Check, Mail, MapPin } from 'lucide-react';
import { profile } from '../../data/profile';

export const Contact = () => {
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  async function copyEmail() { try { await navigator.clipboard.writeText(profile.email); setCopied(true); setStatus('Email address copied.'); } catch { setStatus(`Copy this address: ${profile.email}`); } }
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !email || !message) { setStatus('Please add your name, email and a short message.'); return; }
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Hi Akash,\n\n${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus('Your email app can send this draft. If it didn’t open, use the email address alongside.');
  }
  return <section id="contact" className="portfolio-section contact-section" aria-labelledby="contact-heading"><div className="studio-section-label"><span>05 / SAY HELLO</span><span>Good things start with a conversation.</span></div><div className="contact-shell"><div className="contact-copy"><span className="availability"><i />Open to opportunities</span><h2 id="contact-heading">Have an idea?<br /><span>Let’s talk.</span></h2><p>A role, a project, or a good conversation about something you’re building. I’d love to hear about it.</p><div className="contact-address"><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} /></a><button type="button" className="round-control" aria-label="Copy email address" onClick={copyEmail}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div><span className="contact-location"><MapPin size={15} />{profile.location}</span><div className="contact-social"><a href="https://github.com/sakashdora" target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14} /></a><a href="https://linkedin.com/in/sakashdora" target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={14} /></a></div></div><form className="contact-form" onSubmit={prepareEmail}><div className="widget-heading"><span><Mail size={18} />Leave a note</span></div><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="How should I call you?" maxLength={100} required /><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={200} required /><label htmlFor="contact-message">What’s on your mind?</label><textarea id="contact-message" name="message" placeholder="A little about your idea or opportunity…" rows={4} maxLength={2000} required /><button type="submit" className="studio-button dark-button">Open email draft<ArrowUpRight size={17} /></button><p className="contact-form-note">Opens your email app with your message ready to send.</p></form></div><p className="contact-status" role="status">{status}</p></section>;
};
