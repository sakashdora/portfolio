import { useState } from 'react';
import { ArrowUpRight, Braces, Cloud, Code2, Database, Server } from 'lucide-react';
import { skills } from '../../data/skills';

const categories = [
  { key: 'frontend', label: 'Frontend', icon: Code2, headline: 'The part people feel.', description: 'Responsive interfaces, accessible components, and considered interactions.', example: 'From a property search to a trading journal.', symbol: '</>' },
  { key: 'backend', label: 'Backend', icon: Server, headline: 'The logic behind it all.', description: 'APIs and application services that connect the interface to dependable data.', example: 'Building the connections that make a product work.', symbol: '{ }' },
  { key: 'database', label: 'Data', icon: Database, headline: 'A place for every detail.', description: 'Structured data, clear models, and practical storage choices.', example: 'From a first schema to the queries behind a feature.', symbol: '01' },
  { key: 'tools', label: 'Cloud & tools', icon: Cloud, headline: 'From local to live.', description: 'Version control, deployment, and tools that keep the work moving.', example: 'A thoughtful workflow from idea to release.', symbol: '↗' },
] as const;

export const Skills = () => {
  const [active, setActive] = useState(0);
  const category = categories[active];
  return <section id="skills" className="portfolio-section toolkit-section" aria-labelledby="skills-heading">
    <div className="studio-section-label"><span>03 / THE TOOLKIT</span><span>The right tool. The right reason.</span></div>
    <div className="section-intro"><h2 id="skills-heading">What I build with<span>.</span></h2><p>A mix of familiar tools and a willingness to learn what the next idea needs.</p></div>
    <div className="toolkit-shell"><div className="toolkit-menu" aria-label="Skill categories">{categories.map((item, index) => <button key={item.key} type="button" aria-pressed={index === active} aria-controls="toolkit-content" onClick={() => setActive(index)}><item.icon size={20} /><span>{item.label}</span><ArrowUpRight size={17} /></button>)}<div className="toolkit-note"><Braces size={28} strokeWidth={1} /><p>Always a work<br />in progress.</p></div></div><div id="toolkit-content" className="toolkit-content" aria-live="polite"><div className="toolkit-title"><div><span className="studio-eyebrow">{category.label}</span><h3>{category.headline}</h3><p>{category.description}</p></div><span className="toolkit-symbol" aria-hidden="true">{category.symbol}</span></div><div className="tool-grid">{skills[category.key].map((skill, index) => <div className="tool-tile" key={skill}><span className="tool-number">{String(index + 1).padStart(2, '0')}</span><strong>{skill}</strong><span className="tool-dot" /></div>)}</div><div className="toolkit-bottom"><span>{category.example}</span><a className="inline-link" href="#projects">See it in the work<ArrowUpRight size={15} /></a></div></div></div>
  </section>;
};
