import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { scrollToId, scrollToY, setScrollLocked } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const names = ['Disease Prediction', 'E-Commerce', 'Homelux', 'Tradevault', 'Veil'];
const kickers = ['Applied machine learning', 'Commerce platform', 'Property discovery', 'Trading dashboard', 'Security analytics'];

type Project = (typeof projects)[number];
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Project showcase: on desktop the section pins to the screen and the cards
 * travel sideways as you scroll down. On phones (and for reduced motion) it
 * becomes a native swipeable strip.
 */
export const Projects = () => {
  const [active, setActive] = useState(0);
  const [modalProject, setModalProject] = useState<Project>(projects[0]);

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const details = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // ---- pinned horizontal scroll (desktop) ---------------------------------
  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const getEnd = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const getPad = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;

      const update = () => {
        const x = Number(gsap.getProperty(track, 'x')) || 0;
        const end = getEnd() || 1;
        const vw = viewport.clientWidth;
        let best = 0;
        let bestDistance = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const distance = Math.abs(card.offsetLeft + x - getPad());
          if (distance < bestDistance) { bestDistance = distance; best = i; }
          // parallax: the screenshot drifts slower than the card around it
          const centre = card.offsetLeft + card.offsetWidth / 2 + x;
          const rel = (centre - vw / 2) / vw;
          const img = card.querySelector<HTMLElement>('.work-media img');
          if (img) img.style.transform = `translate3d(${(rel * -56).toFixed(1)}px,0,0) scale(1.16)`;
        });
        setActive(best);
        if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, -x / end))})`;
      };

      const tween = gsap.to(track, { x: () => -getEnd(), ease: 'none', onUpdate: update });
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${getEnd()}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tween,
      });
      update();

      return () => {
        triggerRef.current = null;
        track.style.removeProperty('transform');
        cardRefs.current.forEach((card) => card?.querySelector<HTMLElement>('.work-media img')?.style.removeProperty('transform'));
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => { window.removeEventListener('load', refresh); mm.revert(); };
  }, []);

  // ---- jump to a project (chapter buttons, keyboard focus, #proj-n links) ----
  const goTo = (index: number) => {
    const card = cardRefs.current[index];
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!card || !track || !viewport) return;
    const st = triggerRef.current;
    if (st) {
      const end = Math.max(1, track.scrollWidth - viewport.clientWidth);
      const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const fraction = Math.min(1, Math.max(0, (card.offsetLeft - padLeft) / end));
      scrollToY(st.start + fraction * (st.end - st.start));
    } else {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  useEffect(() => {
    const readHash = () => {
      const index = projects.findIndex(item => `#${item.id}` === window.location.hash);
      if (index < 0) return;
      scrollToId('projects');
      window.setTimeout(() => goTo(index), 900);
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- details dialog ---------------------------------------------------------
  function openDetails(project: Project) {
    setModalProject(project);
    setScrollLocked(true);
    details.current?.showModal();
    closeButton.current?.focus();
  }

  return (
    <section ref={sectionRef} id="projects" className="work-section" aria-labelledby="projects-heading">
      <div className="work-stage">
        <header className="work-top">
          <div>
            <p className="work-label"><span>02 / SELECTED WORK</span></p>
            <h2 id="projects-heading" className="work-heading">Things I’ve <em>built</em></h2>
          </div>
          <div className="work-side">
            <span className="work-counter" aria-live="polite"><b>{pad(active + 1)}</b> / {pad(projects.length)}</span>
            <nav className="work-chapters" aria-label="Choose a project">
              {projects.map((item, index) => (
                <button key={item.id} type="button" aria-current={active === index} onClick={() => goTo(index)}>
                  <i>{pad(index + 1)}</i>{names[index]}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <div ref={viewportRef} className="work-viewport" data-lenis-prevent-touch>
          <div ref={trackRef} className="work-track">
            {projects.map((project, index) => (
              <article
                key={project.id}
                ref={(node) => { cardRefs.current[index] = node; }}
                className="work-card"
                data-active={active === index}
                aria-label={`${names[index]}, project ${index + 1} of ${projects.length}`}
                onFocusCapture={() => { if (active !== index) goTo(index); }}
              >
                <button type="button" className="work-media" onClick={() => openDetails(project)} aria-label={`Open ${project.title} details`}>
                  <img src={project.image} alt={`${project.title} preview`} width="1400" height="700" loading="lazy" decoding="async" draggable={false} />
                  <span className="work-media-cta">View details <ArrowUpRight size={16} /></span>
                </button>
                <div className="work-info">
                  <span className="work-index" aria-hidden="true">{pad(index + 1)}</span>
                  <div className="work-copy">
                    <span className="work-kicker">{kickers[index]}</span>
                    <h3>{names[index]}</h3>
                    <p className="work-short">{project.shortDescription}</p>
                    <p className="work-desc">{project.description}</p>
                    <ul className="work-chips">{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
                  </div>
                  <button type="button" className="work-button" onClick={() => openDetails(project)}>Explore project <ArrowRight size={16} /></button>
                </div>
              </article>
            ))}
            <div className="work-outro">
              <h3>Have something <em>in mind?</em></h3>
              <p>I’m always up for a good idea, a role, or a conversation about something you’re building.</p>
              <a className="work-button" href="#contact">Let’s talk <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </div>

        <div className="work-foot" aria-hidden="true">
          <span>Scroll to explore</span>
          <div className="work-progress"><span ref={barRef} /></div>
          <span>{pad(projects.length)} projects · Web · AI · Full stack</span>
        </div>
      </div>

      <dialog
        ref={details}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        data-lenis-prevent
        onClose={() => setScrollLocked(false)}
        onClick={event => { if (event.target === event.currentTarget) details.current?.close(); }}
      >
        <div className="project-dialog-content">
          <button ref={closeButton} type="button" className="round-control dialog-close" aria-label="Close project details" onClick={() => details.current?.close()}><X size={20} /></button>
          <img src={modalProject.image} alt={`${modalProject.title} full preview`} />
          <div className="project-dialog-body">
            <span className="studio-eyebrow">PROJECT NOTES</span>
            <h2 id="project-dialog-title">{modalProject.title}</h2>
            <p>{modalProject.description}</p>
            <div className="tool-tags">{modalProject.tech.map(tech => <span key={tech}>{tech}</span>)}</div>
            <div className="project-dialog-links">
              {modalProject.demoUrl !== '#' && <a className="studio-button dark-button" href={modalProject.demoUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={15} /></a>}
              {modalProject.githubUrl !== '#' && <a className="studio-button" href={modalProject.githubUrl} target="_blank" rel="noreferrer">Source code <Github size={15} /></a>}
              <a className="inline-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(`Tell me about ${modalProject.title}`)}`}>Ask me about this project <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
};
