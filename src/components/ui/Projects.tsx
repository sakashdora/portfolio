import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';
import { projects } from '../../data/projects';

const names = ['Disease Prediction', 'E-Commerce', 'Homelux', 'Tradevault', 'Veil'];

export const Projects = () => {
  const [active, setActive] = useState(2);
  const project = projects[active];
  const details = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [modalProject, setModalProject] = useState(project);
  useEffect(() => {
    const readHash = () => { const index = projects.findIndex(item => `#${item.id}` === window.location.hash); if (index >= 0) { setActive(index); document.getElementById('projects')?.scrollIntoView({ behavior: 'auto' }); } };
    readHash(); window.addEventListener('hashchange', readHash); return () => window.removeEventListener('hashchange', readHash);
  }, []);
  function openDetails() { setModalProject(project); details.current?.showModal(); closeButton.current?.focus(); }
  const previewIndices = [(active + 1) % projects.length, (active + 2) % projects.length];
  return (
    <section id="projects" className="portfolio-section project-section" aria-labelledby="projects-heading">
      <div className="studio-section-label"><span>02 / SELECTED WORK</span><span>Ideas, out in the world.</span></div>
      <div className="project-stage">
        <img className={`project-backdrop ${active === 2 ? 'is-architecture' : ''}`} src={active === 2 ? '/assets/homelux-atmosphere.png' : project.image} alt="" />
        <div className="project-shade" />
        <div className="project-stage-top"><span className="project-counter">SELECTED WORK <b>{String(active + 1).padStart(2, '0')} / 05</b></span><div className="project-switcher" aria-label="Choose a project">{projects.map((item, index) => <button type="button" aria-pressed={active === index} key={item.id} onClick={() => setActive(index)}>{names[index]}</button>)}</div><div className="project-arrows"><button type="button" aria-label="Previous project" onClick={() => setActive((active + projects.length - 1) % projects.length)}><ArrowLeft size={20} /></button><button type="button" aria-label="Next project" onClick={() => setActive((active + 1) % projects.length)}><ArrowRight size={20} /></button></div></div>
        <div className="project-stage-title" aria-live="polite"><p>DESIGNED. DEVELOPED. BROUGHT TO LIFE.</p><h2 id="projects-heading">{names[active]}</h2><span>{project.shortDescription}</span></div>
        <div className="project-stage-content">
          <div className="project-story"><span className="studio-eyebrow">{active === 2 ? 'PROPERTY DISCOVERY' : active === 0 ? 'APPLIED MACHINE LEARNING' : 'FULL-STACK DEVELOPMENT'}</span><p>{project.description}</p><div className="project-tech">{project.tech.slice(0, 4).join(' · ')}</div><button type="button" className="studio-button" onClick={openDetails}>Explore project <ArrowUpRight size={17} /></button></div>
          <button type="button" className="project-preview" onClick={openDetails} aria-label={`View ${project.title} details`}><img src={project.image} alt={`${project.title} preview`} loading="lazy" /><span>Inside the experience <ArrowUpRight size={17} /></span></button>
          <div className="project-next-previews">{previewIndices.map(index => <button key={projects[index].id} type="button" onClick={() => setActive(index)} aria-label={`Show ${names[index]}`}><img src={projects[index].image} alt="" loading="lazy" /><span>{names[index]}<ArrowUpRight size={15} /></span></button>)}</div>
        </div>
      </div>
      <p className="project-hint">Explore the collection. Select a project to see its story.<span>05 projects / Web · AI · Full stack</span></p>
      <dialog ref={details} className="project-dialog" aria-labelledby="project-dialog-title" onClick={event => { if (event.target === event.currentTarget) details.current?.close(); }}>
        <div className="project-dialog-content"><button ref={closeButton} type="button" className="round-control dialog-close" aria-label="Close project details" onClick={() => details.current?.close()}><X size={20} /></button><img src={modalProject.image} alt={`${modalProject.title} full preview`} /><div className="project-dialog-body"><span className="studio-eyebrow">PROJECT NOTES</span><h2 id="project-dialog-title">{modalProject.title}</h2><p>{modalProject.description}</p><div className="tool-tags">{modalProject.tech.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-dialog-links">{modalProject.demoUrl !== '#' && <a className="studio-button dark-button" href={modalProject.demoUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={15} /></a>}{modalProject.githubUrl !== '#' && <a className="studio-button" href={modalProject.githubUrl} target="_blank" rel="noreferrer">Source code <Github size={15} /></a>}<a className="inline-link" href={`mailto:sakashdora@gmail.com?subject=${encodeURIComponent(`Tell me about ${modalProject.title}`)}`}>Ask me about this project <ArrowUpRight size={16} /></a></div></div></div>
      </dialog>
    </section>
  );
};
