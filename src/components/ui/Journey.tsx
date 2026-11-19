import { ArrowUpRight, BriefcaseBusiness, GraduationCap, BadgeCheck } from 'lucide-react';
import { profile } from '../../data/profile';

export const Journey = () => (
  <section id="journey" className="portfolio-section journey-section" aria-labelledby="journey-heading">
    <div className="studio-section-label"><span>04 / THE JOURNEY</span><span>Learning by doing.</span></div>
    <div className="journey-layout"><div className="journey-intro"><span className="studio-eyebrow">A LITTLE CONTEXT</span><h2 id="journey-heading">Still curious.<br /><span>Still building.</span></h2><p>Classrooms gave me the foundations. Projects and real teams taught me how to put them to work.</p><a className="studio-button" href="/cv.html">Read my full CV<ArrowUpRight size={17} /></a><div className="journey-note"><span className="note-pin" /><span>From learning the fundamentals<br />to making something useful.</span></div></div><div className="journey-entries"><article className="journey-entry"><div className="journey-icon"><BriefcaseBusiness size={19} /></div><div><div className="journey-meta"><span>EXPERIENCE</span><span>{profile.experience.period}</span></div><h3>{profile.experience.title}</h3><h4>{profile.experience.organization}</h4><p>{profile.experience.detail}</p><div className="tool-tags">{profile.experience.tech.map(tech => <span key={tech}>{tech}</span>)}</div></div></article>{profile.education.map(item => <article className="journey-entry" key={item.title}><div className="journey-icon"><GraduationCap size={20} /></div><div><div className="journey-meta"><span>EDUCATION</span><span>{item.period}</span></div><h3>{item.title}</h3><h4>{item.organization}</h4><p>{item.detail}</p></div></article>)}</div></div>
    <div className="certification-strip"><span><BadgeCheck size={18} />Along the way</span>{profile.certifications.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.organization}</p></div>)}</div>
  </section>
);
