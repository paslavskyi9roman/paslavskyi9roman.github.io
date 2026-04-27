import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AudioState {
  volume: number;
  muted: boolean;
  hasInteracted: boolean;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  markInteracted: () => void;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      volume: 0.5,
      muted: false,
      hasInteracted: false,
      setVolume: (v) => set({ volume: clamp(v) }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      markInteracted: () => set({ hasInteracted: true }),
    }),
    {
      name: 'madrid-noir-audio',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ volume: state.volume, muted: state.muted }),
    },
  ),
);
