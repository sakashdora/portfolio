import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUp, ArrowUpRight, BriefcaseBusiness, Clock, Download, GraduationCap, Github, Globe, Layers, Linkedin, Mail, MapPin, Network, Sparkles } from 'lucide-react';
import { profile } from '../../data/profile';
import { social } from '../../data/social';
import { MusicPlayer } from '../portfolio/MusicPlayer';
import { askAssistant } from '../../lib/chat';

const capabilities = [
  { icon: Layers, title: 'Interfaces with intention', text: 'React, responsive design and thoughtful interactions that feel right on any screen.' },
  { icon: Network, title: 'Connected systems', text: 'APIs, databases and the logic behind the experience, built to stay dependable.' },
  { icon: Sparkles, title: 'Practical intelligence', text: 'AI integrations that make a product genuinely more useful, not just more novel.' },
];

const socialIcons = { github: Github, linkedin: Linkedin, mail: Mail } as const;
const contactLinks = social.filter(item => item.icon in socialIcons);

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(timer);
  }, []);
  const label = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
  return (
    <span className="about-chip">
      <Clock size={14} aria-hidden="true" />
      <time dateTime={now.toISOString()}>{label}</time>
      <span className="about-chip-muted">IST</span>
    </span>
  );
}

const IST_OFFSET_MINUTES = 330;

/** Compares the visitor's local time zone with Akash's (IST). */
function TimeGap() {
  const [text, setText] = useState('');
  useEffect(() => {
    const diff = -new Date().getTimezoneOffset() - IST_OFFSET_MINUTES;
    if (diff === 0) { setText('You’re on my time zone'); return; }
    const hours = Math.floor(Math.abs(diff) / 60);
    const minutes = Math.abs(diff) % 60;
    const amount = [hours ? `${hours}h` : '', minutes ? `${minutes}m` : ''].filter(Boolean).join(' ');
    setText(`You’re ${amount} ${diff > 0 ? 'ahead of' : 'behind'} me`);
  }, []);
  if (!text) return null;
  return <p className="about-gap"><Globe size={14} aria-hidden="true" />{text}</p>;
}

const questions = ['What do you build?', 'Tell me about Tradevault', 'What are your skills?', 'Are you open to roles?'];

/** Suggested questions and a free-text box that hand off to the AI assistant. */
function AskCard() {
  const [value, setValue] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    askAssistant(value);
    setValue('');
  };
  return (
    <article className="about-ask" aria-labelledby="ask-title">
      <div>
        <span className="studio-eyebrow">ASK THE AI ASSISTANT</span>
        <h3 id="ask-title">Curious? Ask away.</h3>
      </div>
      <div className="ask-chips">
        {questions.map(question => <button key={question} type="button" onClick={() => askAssistant(question)}>{question}</button>)}
      </div>
      <form className="ask-form" onSubmit={submit}>
        <input value={value} onChange={event => setValue(event.target.value)} placeholder="Or type your own question…" maxLength={200} aria-label="Ask the AI assistant a question" />
        <button type="submit" aria-label="Send question" disabled={!value.trim()}><ArrowUp size={16} /></button>
      </form>
    </article>
  );
}

export const About = () => {
  const education = profile.education[0];
  return (
    <section id="about" className="portfolio-section about-section" aria-labelledby="about-title">
      <div className="studio-section-label"><span>01 / BEHIND THE SCREEN</span><span>A little work. A little life.</span></div>

      <header className="about-head">
        <div>
          <span className="about-eyebrow">HELLO, I’M AKASH</span>
          <h2 id="about-title">A developer’s mind. <em>A curious soul.</em></h2>
        </div>
        <p className="about-lede">{profile.summary}</p>
      </header>

      <div className="about-grid">
        <article className="about-portrait" aria-label="About S Akash Dora">
          <div className="about-chips">
            <span className="about-chip"><i className="chip-dot" aria-hidden="true" />Open to opportunities</span>
            <LocalTime />
          </div>
          <div className="about-avatar">
            <span className="avatar-orbit" aria-hidden="true" />
            <div className="avatar-ring">
              <img src="/assets/profile_pic.webp" alt="S Akash Dora" width="720" height="720" loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="about-id">
            <h3>{profile.name}</h3>
            <p className="about-role">Full-stack developer &amp; AI enthusiast</p>
            <p className="about-place"><MapPin size={14} aria-hidden="true" />{profile.location}</p>
            <TimeGap />
            <div className="about-actions">
              <a className="studio-button dark-button" href="/S_Akash_Dora_Resume.pdf" download><Download size={15} />Résumé</a>
              <div className="about-socials">
                {contactLinks.map(item => {
                  const Icon = socialIcons[item.icon as keyof typeof socialIcons];
                  return (
                    <a key={item.name} className="round-control" href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={item.name}><Icon size={17} /></a>
                  );
                })}
              </div>
            </div>
          </div>
        </article>

        <article className="about-card about-bring">
          <h3 className="about-card-title"><span>What I bring to the table</span><span aria-hidden="true">01</span></h3>
          <div className="bring-list">
            {capabilities.map(({ icon: Icon, title, text }) => (
              <div className="bring-item" key={title}>
                <span className="bring-icon" aria-hidden="true"><Icon size={20} /></span>
                <h4>{title}</h4>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </article>

        <AskCard />

        <article className="about-card about-now">
          <h3 className="about-card-title"><span>Right now</span><span aria-hidden="true">02</span></h3>
          <div className="now-list">
            <div className="now-item">
              <span className="now-icon" aria-hidden="true"><GraduationCap size={18} /></span>
              <div><small>{education.period}</small><strong>{education.title}</strong><span>{education.organization}</span></div>
            </div>
            <div className="now-item">
              <span className="now-icon" aria-hidden="true"><BriefcaseBusiness size={18} /></span>
              <div><small>{profile.experience.period}</small><strong>{profile.experience.title}</strong><span>{profile.experience.organization}</span></div>
            </div>
          </div>
          <a className="inline-link" href="#journey">The full story <ArrowUpRight size={15} /></a>
        </article>

        <MusicPlayer />
      </div>
    </section>
  );
};
