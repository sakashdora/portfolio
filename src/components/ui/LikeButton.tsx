import { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { fetchLikeCount, readLiked, sendLike, storeLiked } from '../../lib/likes';

const compact = new Intl.NumberFormat('en', { notation: 'compact' });

/** A heart in the corner: anyone visiting can like the page (and un-like it). */
export const LikeButton = () => {
  const [liked, setLiked] = useState(readLiked);
  const [count, setCount] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // Load the shared total. If this browser already liked the page, re-send that
  // like (it never double counts) so the server stays in step with this device.
  useEffect(() => {
    let cancelled = false;
    const load = readLiked() ? sendLike(true) : fetchLikeCount();
    load.then(value => { if (!cancelled && value !== null) setCount(value); });
    return () => { cancelled = true; };
  }, []);

  // Seven little hearts that fly outwards when you like the page.
  const particles = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const angle = (-90 + (i - 3) * 26) * (Math.PI / 180);
    const distance = 46 + (i % 3) * 12;
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, delay: i * 18 };
  }), []);

  function toggle() {
    const next = !liked;
    setLiked(next);
    storeLiked(next);
    if (next) setBurst(n => n + 1);
    setCount(value => (value === null ? value : Math.max(0, value + (next ? 1 : -1))));
    sendLike(next).then(value => { if (value !== null) setCount(value); });
  }

  return (
    <div className={`like-fab${visible ? ' is-visible' : ''}`}>
      <button type="button" className="like-btn" aria-pressed={liked} onClick={toggle}>
        <span className="like-heart" key={liked ? 'on' : 'off'}>
          <Heart size={20} aria-hidden="true" />
        </span>
        <span className="like-label">{liked ? 'Liked' : 'Like this page'}</span>
        {count !== null && <span className="like-count" aria-label={`${count} likes`}>{compact.format(count)}</span>}
        {burst > 0 && liked && (
          <span className="like-burst" key={burst} aria-hidden="true">
            {particles.map((p, i) => (
              <i key={i} style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, animationDelay: `${p.delay}ms` } as React.CSSProperties}>♥</i>
            ))}
          </span>
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{liked ? 'Thanks for liking this page.' : ''}</span>
    </div>
  );
};
