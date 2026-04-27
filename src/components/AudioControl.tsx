'use client';

import { useState } from 'react';
import { useAudioStore } from '@/store/useAudioStore';

export function AudioControl() {
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);
  const setVolume = useAudioStore((s) => s.setVolume);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const [hover, setHover] = useState(false);

  const iconState = muted || volume === 0 ? 'muted' : volume < 0.5 ? 'low' : 'high';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => {
          const next = Number(e.target.value);
          setVolume(next);
          if (muted && next > 0) toggleMute();
        }}
        aria-label="Volumen de la música"
        style={{
          width: 64,
          height: 14,
          accentColor: 'var(--red-deep)',
          cursor: 'pointer',
          verticalAlign: 'middle',
        }}
      />
      <button
        type="button"
        onClick={toggleMute}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={muted ? 'Activar música' : 'Silenciar música'}
        aria-pressed={muted}
        style={{
          width: 22,
          height: 22,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hover ? 'var(--ink)' : 'transparent',
          color: hover ? 'var(--paper)' : 'var(--ink)',
          border: '1px solid var(--ink)',
          cursor: 'pointer',
          padding: 0,
          transition: 'background 0.15s ease, color 0.15s ease',
        }}
      >
        <SpeakerIcon state={iconState} />
      </button>
    </span>
  );
}

function SpeakerIcon({ state }: { state: 'muted' | 'low' | 'high' }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="currentColor" />
      {state === 'muted' && <path d="M16 9l5 6M21 9l-5 6" />}
      {state === 'low' && <path d="M16 9c1.5 1 1.5 5 0 6" />}
      {state === 'high' && (
        <>
          <path d="M16 9c1.5 1 1.5 5 0 6" />
          <path d="M19 6c3 2.5 3 9.5 0 12" />
        </>
      )}
    </svg>
  );
}
