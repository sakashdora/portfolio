import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Disc3, Music2, Pause, Play, Repeat2, Upload, Volume2 } from 'lucide-react';
import { formatDuration } from '../../lib/focusTimer';

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [track, setTrack] = useState<{ name: string; url: string } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [loop, setLoop] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => { if (track) URL.revokeObjectURL(track.url); }, [track]);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume, track]);

  function selectTrack(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|ogg|m4a|aac|flac|opus|webm)$/i.test(file.name)) {
      setError('Choose an audio file, such as MP3, WAV or M4A.');
      return;
    }
    audio.current?.pause();
    setPlaying(false);
    setDuration(0);
    setPosition(0);
    setError('');
    setTrack({ name: file.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(file) });
  }

  async function toggle() {
    if (!audio.current || !track) return;
    if (!audio.current.paused) { audio.current.pause(); return; }
    setError('');
    try { await audio.current.play(); }
    catch { setError('This file couldn’t play. Try another audio format.'); setPlaying(false); }
  }

  return (
    <article className="dash-widget music-widget">
      <div className="widget-heading"><span><Music2 size={16} /> A little background music</span></div>
      <div className="music-track"><div className={`record-art ${playing ? 'is-playing' : ''}`} aria-hidden="true"><Disc3 size={54} strokeWidth={0.8} /></div><div><span className="tiny-label">{playing ? 'NOW PLAYING' : track ? 'READY WHEN YOU ARE' : 'YOUR SOUNDTRACK'}</span><h3 title={track?.name}>{track?.name ?? 'Set the mood.'}</h3><p>{track ? 'Playing from your device' : 'Bring a track you love.'}</p></div></div>
      <audio ref={audio} src={track?.url} loop={loop} preload="metadata" onLoadedMetadata={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onTimeUpdate={event => setPosition(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { if (track) { setError('This file couldn’t load. Please choose another.'); setPlaying(false); } }} />
      <label className="sr-only" htmlFor="music-position">Track position</label><input id="music-position" className="music-seek" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(position, duration || 1)} disabled={!duration} onChange={event => { const next = Number(event.target.value); if (audio.current) audio.current.currentTime = next; setPosition(next); }} />
      <div className="music-time"><span>{formatDuration(position)}</span><span>{formatDuration(duration)}</span></div>
      <div className="music-controls"><button className="round-control music-play" type="button" disabled={!track || !duration} aria-label={playing ? 'Pause music' : 'Play music'} onClick={toggle}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button><button className="round-control" type="button" aria-label="Repeat track" aria-pressed={loop} onClick={() => setLoop(!loop)}><Repeat2 size={17} /></button><Volume2 size={16} aria-hidden="true" /><label className="sr-only" htmlFor="music-volume">Music volume</label><input id="music-volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={event => setVolume(Number(event.target.value))} /></div>
      <input ref={fileInput} type="file" accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.opus" onChange={selectTrack} className="sr-only" tabIndex={-1} aria-label="Choose a local audio file" />
      <button className="music-upload" type="button" onClick={() => fileInput.current?.click()}><Upload size={14} />{track ? 'Change audio file' : 'Choose an audio file'}</button>
      <p className="widget-note" role="status">{error || 'Stays on your device. Nothing is uploaded.'}</p>
    </article>
  );
}
