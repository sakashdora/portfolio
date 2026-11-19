import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Code2, Download, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { profile } from '../../data/profile';
import { social } from '../../data/social';
import { FocusTimer } from '../portfolio/FocusTimer';
import { MusicPlayer } from '../portfolio/MusicPlayer';

function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  return <div className="local-clock"><span className="clock-dot" /><div><time dateTime={now.toISOString()}>{now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })}</time><small>Bhubaneswar · IST</small></div></div>;
}

export const About = () => {
  const [tab, setTab] = useState<'overview' | 'background'>('overview');
  return (
    <section id="about" className="portfolio-section dashboard-section" aria-labelledby="about-title">
      <div className="studio-section-label"><span>01 / BEHIND THE SCREEN</span><span>A little work. A little life.</span></div>
      <div className="personal-dashboard">
        <aside className="profile-rail">
          <a href="#home" className="profile-monogram" aria-label="Back to home">ad<span>.</span></a>
          <img className="dashboard-portrait" src="/assets/profile_pic.png" alt="S Akash Dora" width="300" height="370" loading="lazy" />
          <div><h3>{profile.name}</h3><p className="profile-role">Full-stack developer<br />& AI enthusiast</p></div>
          <div className="profile-location"><MapPin size={14} /><span>{profile.location}</span></div>
          <span className="availability"><i />Open to opportunities</span>
          <a className="studio-button profile-resume" href="/S_Akash_Dora_Resume.pdf" download><Download size={15} />My résumé<ArrowUpRight size={14} /></a>
          <div className="profile-socials">{social.filter(item => item.name !== 'X').map(item => <a key={item.name} href={item.url}>{item.name}<ArrowUpRight size={11} /></a>)}</div>
          <p className="profile-footnote">Curious by nature.<br />Precise by practice.</p>
        </aside>
        <div className="dashboard-main">
          <div className="dashboard-toolbar"><div className="dashboard-tabs" role="tablist" aria-label="About Akash" onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const next = event.key === "Home" ? "overview" : event.key === "End" ? "background" : tab === "overview" ? "background" : "overview"; setTab(next); document.getElementById(`${next}-tab`)?.focus(); }}><button type="button" id="overview-tab" role="tab" tabIndex={tab === 'overview' ? 0 : -1} aria-selected={tab === 'overview'} aria-controls="about-overview" onClick={() => setTab('overview')}>Overview</button><button type="button" id="background-tab" role="tab" tabIndex={tab === 'background' ? 0 : -1} aria-selected={tab === 'background'} aria-controls="about-background" onClick={() => setTab('background')}>My background</button></div><LocalClock /></div>
          <div className="dashboard-intro"><span className="studio-eyebrow">HELLO, I'M AKASH</span><h2 id="about-title">A developer’s mind.<br /><span>A curious soul.</span></h2><p>{profile.summary}</p></div>
          <div id="about-overview" role="tabpanel" aria-labelledby="overview-tab" hidden={tab !== 'overview'}>
            <div className="dashboard-overview">
              <article className="dash-widget work-widget"><div className="widget-heading"><span><Code2 size={16} /> What I bring to the table</span><ArrowDownRight size={17} /></div><div className="capability-line"><span>01</span><div><h3>Interfaces with intention</h3><p>React, responsive design & thoughtful interactions.</p></div></div><div className="capability-line"><span>02</span><div><h3>Connected systems</h3><p>APIs, databases & the logic behind the experience.</p></div></div><div className="capability-line"><span>03</span><div><h3>Practical intelligence</h3><p>AI integrations that make a product more useful.</p></div></div></article>
              <a className="craft-widget" href="#projects"><div><span className="studio-eyebrow">IDEA → INTERFACE → EXPERIENCE</span><h3>Good software.<br />Human at heart.</h3></div><div className="glass-sculpture" aria-hidden="true"><i /><i /><i /></div><span>See what I’m building <ArrowUpRight size={19} /></span></a>
            </div>
          </div>
          <div id="about-background" role="tabpanel" aria-labelledby="background-tab" hidden={tab !== 'background'} className="dashboard-background">
            <article className="dash-widget"><div className="widget-heading"><span><GraduationCap size={17} /> Education</span></div>{profile.education.map(item => <div className="background-entry" key={item.title}><small>{item.period}</small><h3>{item.title}</h3><p>{item.organization}</p></div>)}</article>
            <article className="dash-widget"><div className="widget-heading"><span><BriefcaseBusiness size={17} /> Hands-on experience</span></div><div className="background-entry"><small>{profile.experience.period}</small><h3>{profile.experience.title}</h3><p>{profile.experience.organization}</p><p>{profile.experience.detail}</p></div><a className="inline-link" href="#journey">The full story <ArrowUpRight size={15} /></a></article>
          </div>
          <div className="dashboard-bottom"><MusicPlayer /><FocusTimer /></div>
          <div className="dashboard-status"><span><Sparkles size={13} />Building, learning, and finding better ways.</span><a href="/cv.html">More about me <ArrowUpRight size={13} /></a></div>
        </div>
      </div>
    </section>
  );
};
