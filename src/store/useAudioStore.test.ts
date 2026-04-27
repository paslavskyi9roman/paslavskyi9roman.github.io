import { beforeEach, describe, expect, it } from 'vitest';
import { useAudioStore } from './useAudioStore';

const resetStore = () => {
  useAudioStore.persist.clearStorage();
  useAudioStore.setState({ volume: 0.5, muted: false, hasInteracted: false });
};

describe('useAudioStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('toggles mute', () => {
    expect(useAudioStore.getState().muted).toBe(false);
    useAudioStore.getState().toggleMute();
    expect(useAudioStore.getState().muted).toBe(true);
    useAudioStore.getState().toggleMute();
    expect(useAudioStore.getState().muted).toBe(false);
  });

  it('clamps volume to [0, 1]', () => {
    useAudioStore.getState().setVolume(0.3);
    expect(useAudioStore.getState().volume).toBe(0.3);
    useAudioStore.getState().setVolume(-1);
    expect(useAudioStore.getState().volume).toBe(0);
    useAudioStore.getState().setVolume(5);
    expect(useAudioStore.getState().volume).toBe(1);
  });

  it('marks user interaction', () => {
    expect(useAudioStore.getState().hasInteracted).toBe(false);
    useAudioStore.getState().markInteracted();
    expect(useAudioStore.getState().hasInteracted).toBe(true);
  });

  it('persists volume and muted but not hasInteracted', () => {
    useAudioStore.getState().setVolume(0.25);
    useAudioStore.getState().toggleMute();
    useAudioStore.getState().markInteracted();

    const persisted = JSON.parse(localStorage.getItem('madrid-noir-audio') ?? '{}') as {
      state?: { volume?: number; muted?: boolean; hasInteracted?: boolean };
    };
    expect(persisted.state?.volume).toBe(0.25);
    expect(persisted.state?.muted).toBe(true);
    expect(persisted.state?.hasInteracted).toBeUndefined();
  });
});
