'use client';

import { useAudioStore } from '@/store/useAudioStore';

export type SfxName = 'examine' | 'record' | 'journal-open' | 'lightbox-open' | 'lightbox-close';

const SFX_SOURCES: Record<SfxName, string> = {
  examine: '/assets/sfx/examine.mp3',
  record: '/assets/sfx/record.mp3',
  'journal-open': '/assets/sfx/journal-open.mp3',
  'lightbox-open': '/assets/sfx/lightbox-open.mp3',
  'lightbox-close': '/assets/sfx/lightbox-close.mp3',
};

const cache = new Map<SfxName, HTMLAudioElement>();

const getAudio = (name: SfxName): HTMLAudioElement => {
  let audio = cache.get(name);
  if (!audio) {
    audio = new Audio(SFX_SOURCES[name]);
    audio.preload = 'auto';
    cache.set(name, audio);
  }
  return audio;
};

export const playSfx = (name: SfxName): void => {
  if (typeof window === 'undefined') return;
  const { muted, hasInteracted, volume } = useAudioStore.getState();
  if (muted || !hasInteracted) return;
  const audio = getAudio(name);
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.currentTime = 0;
  audio.play().catch(() => {});
};
