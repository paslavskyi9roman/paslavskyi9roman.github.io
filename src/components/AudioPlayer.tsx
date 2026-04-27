'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/store/useAudioStore';

const TRACKS = ['/assets/tracks/Leather%20Whiskey.mp3', '/assets/tracks/Vinyl%20Sorrow.mp3'];

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const volume = useAudioStore((s) => s.volume);
  const muted = useAudioStore((s) => s.muted);
  const hasInteracted = useAudioStore((s) => s.hasInteracted);
  const markInteracted = useAudioStore((s) => s.markInteracted);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    if (!hasInteracted) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {});
  }, [hasInteracted, trackIndex]);

  useEffect(() => {
    if (hasInteracted) return;
    const onGesture = () => {
      markInteracted();
    };
    window.addEventListener('pointerdown', onGesture, { once: true });
    window.addEventListener('keydown', onGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [hasInteracted, markInteracted]);

  const handleEnded = () => {
    setTrackIndex((i) => (i + 1) % TRACKS.length);
  };

  return <audio ref={audioRef} src={TRACKS[trackIndex]} onEnded={handleEnded} preload="auto" />;
}
