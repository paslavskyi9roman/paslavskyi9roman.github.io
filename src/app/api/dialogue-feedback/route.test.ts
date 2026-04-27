import { describe, expect, it } from 'vitest';
import { deterministicFeedback } from './route';

describe('deterministicFeedback', () => {
  it('returns the time-question branch for "hora"', () => {
    const out = deterministicFeedback('¿A qué hora llegaste?');
    expect(out.feedback.isUnderstandable).toBe(true);
    expect(out.feedback.xpAwarded).toBe(12);
    expect(out.npcReply).toContain('22:30');
  });

  it('returns the alibi branch for "sola"', () => {
    const out = deterministicFeedback('¿Estabas sola?');
    expect(out.feedback.isUnderstandable).toBe(true);
    expect(out.feedback.xpAwarded).toBe(10);
  });

  it('falls back to the unintelligible branch with a suggested correction', () => {
    const out = deterministicFeedback('asdfgh');
    expect(out.feedback.isUnderstandable).toBe(false);
    expect(out.feedback.suggestedCorrection).toBeTruthy();
    expect(out.feedback.xpAwarded).toBeLessThan(5);
  });
});
