import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { ArrowUpRight, Briefcase, Compass, Copy, CornerDownLeft, Cpu, Download, Github, Home, Linkedin, Search, Send, Sparkles, SquareTerminal, User } from 'lucide-react';
import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { social } from '../../data/social';
import { scrollToId, setScrollLocked } from '../../lib/animations';
import { askAssistant } from '../../lib/chat';

type Icon = ComponentType<{ size?: number }>;
type Command = { id: string; group: string; label: string; hint?: string; icon: Icon; keywords: string; run: () => void };

const projectNames = ['Disease Prediction', 'E-Commerce', 'Homelux', 'Tradevault', 'Veil'];
const sectionItems: Array<[string, string, Icon]> = [
  ['home', 'Home', Home], ['about', 'About', User], ['projects', 'Projects', Briefcase],
  ['skills', 'Skills', Cpu], ['journey', 'Journey', Compass], ['contact', 'Contact', Send],
];
const link = (name: string) => social.find(item => item.name === name)?.url ?? '#';

/** Ctrl/Cmd + K quick menu: jump anywhere, open a project, or run an action. */
export const CommandPalette = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState('');

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const openProject = (id: string) => {
      history.replaceState(null, '', `#${id}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    };
    return [
      ...sectionItems.map(([id, label, icon]): Command => ({ id: `go-${id}`, group: 'Go to', label, hint: 'Section', icon, keywords: `${id} section page`, run: () => scrollToId(id) })),
      ...projects.map((project, i): Command => ({ id: `project-${project.id}`, group: 'Projects', label: projectNames[i], hint: project.shortDescription, icon: Briefcase, keywords: `${project.title} ${project.tech.join(' ')} project work`, run: () => openProject(project.id) })),
      { id: 'resume', group: 'Actions', label: 'Download résumé', hint: 'PDF', icon: Download, keywords: 'resume cv pdf download', run: () => { const a = document.createElement('a'); a.href = '/S_Akash_Dora_Resume.pdf'; a.download = 'S_Akash_Dora_Resume.pdf'; a.click(); } },
      { id: 'email', group: 'Actions', label: 'Copy email address', hint: profile.email, icon: Copy, keywords: 'email mail contact copy', run: () => { navigator.clipboard.writeText(profile.email).then(() => showToast('Email address copied'), () => { window.location.href = `mailto:${profile.email}`; }); } },
      { id: 'github', group: 'Actions', label: 'Open GitHub', hint: 'github.com/sakashdora', icon: Github, keywords: 'github code source', run: () => window.open(link('GitHub'), '_blank', 'noopener') },
      { id: 'linkedin', group: 'Actions', label: 'Open LinkedIn', hint: 'linkedin.com/in/sakashdora', icon: Linkedin, keywords: 'linkedin social network', run: () => window.open(link('LinkedIn'), '_blank', 'noopener') },
      { id: 'terminal', group: 'Actions', label: 'Open the terminal', hint: 'Easter egg', icon: SquareTerminal, keywords: 'terminal console code fun', run: () => { scrollToId('home'); window.setTimeout(() => window.dispatchEvent(new Event('open-terminal')), 700); } },
    ];
  }, [showToast]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q ? commands.filter(c => `${c.label} ${c.keywords} ${c.group}`.toLowerCase().includes(q)) : commands;
    if (q) {
      matches.push({ id: 'ask', group: 'Ask', label: `Ask the assistant: “${query.trim()}”`, hint: 'AI', icon: Sparkles, keywords: '', run: () => askAssistant(query.trim()) });
    }
    return matches;
  }, [commands, query]);

  const close = useCallback(() => dialogRef.current?.close(), []);
  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery('');
    setActive(0);
    setScrollLocked(true);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);

  const run = (command: Command | undefined) => {
    if (!command) return;
    close();
    window.setTimeout(command.run, 120);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialogRef.current?.open) close(); else open();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('palette:open', open);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('palette:open', open); };
  }, [open, close]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [active, results]);

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(i => (i + 1) % results.length); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(i => (i - 1 + results.length) % results.length); }
    else if (event.key === 'Enter') { event.preventDefault(); run(results[active]); }
  };

  let lastGroup = '';
  return (
    <>
      <dialog
        ref={dialogRef}
        className="palette"
        aria-label="Quick menu"
        data-lenis-prevent
        onClose={() => setScrollLocked(false)}
        onClick={event => { if (event.target === event.currentTarget) close(); }}
      >
        <div className="palette-box">
          <div className="palette-search">
            <Search size={18} aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search sections, projects and actions…"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
              aria-label="Search the quick menu"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd>Esc</kbd>
          </div>
          <ul id="palette-list" ref={listRef} className="palette-list" role="listbox" aria-label="Results">
            {results.map((command, index) => {
              const header = command.group !== lastGroup;
              lastGroup = command.group;
              const Icon = command.icon;
              return (
                <li key={command.id} role="presentation">
                  {header && <span className="palette-group">{command.group}</span>}
                  <button
                    type="button"
                    id={`palette-${command.id}`}
                    role="option"
                    aria-selected={index === active}
                    tabIndex={-1}
                    className="palette-item"
                    onMouseMove={() => { if (active !== index) setActive(index); }}
                    onClick={() => run(command)}
                  >
                    <span className="palette-icon"><Icon size={16} /></span>
                    <span className="palette-label">{command.label}</span>
                    {command.hint && <span className="palette-hint">{command.hint}</span>}
                    {index === active && <ArrowUpRight size={14} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="palette-foot" aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd><CornerDownLeft size={11} /></kbd> select</span>
            <span><kbd>Esc</kbd> close</span>
          </div>
        </div>
      </dialog>
      <div className="palette-toast" role="status" aria-live="polite">{toast}</div>
    </>
  );
};
