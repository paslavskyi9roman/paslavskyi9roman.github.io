import { describe, expect, it } from 'vitest';
import { DialogueRequestSchema, DialogueResponseSchema } from './schema';

describe('DialogueRequestSchema', () => {
  it('accepts a minimal valid request', () => {
    const result = DialogueRequestSchema.safeParse({
      userText: '¿A qué hora llegaste?',
      npcId: 'npc_lucia_vargas',
      caseId: 'case_001',
      dialogueContext: [],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty userText', () => {
    const result = DialogueRequestSchema.safeParse({
      userText: '   ',
      npcId: 'a',
      caseId: 'b',
      dialogueContext: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects userText longer than 500 chars', () => {
    const result = DialogueRequestSchema.safeParse({
      userText: 'x'.repeat(501),
      npcId: 'a',
      caseId: 'b',
      dialogueContext: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects context with more than 50 messages', () => {
    const message = { speaker: 'npc' as const, text: 'hola', timestamp: 0 };
    const result = DialogueRequestSchema.safeParse({
      userText: 'hola',
      npcId: 'a',
      caseId: 'b',
      dialogueContext: Array.from({ length: 51 }, () => message),
    });
    expect(result.success).toBe(false);
  });
});

describe('DialogueResponseSchema', () => {
  it('accepts a complete response', () => {
    const result = DialogueResponseSchema.safeParse({
      npcReply: 'Estaba sola.',
      feedback: { isUnderstandable: true, xpAwarded: 10, explanation: 'bien' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative xp', () => {
    const result = DialogueResponseSchema.safeParse({
      npcReply: 'x',
      feedback: { isUnderstandable: true, xpAwarded: -1 },
    });
    expect(result.success).toBe(false);
  });

  it('rejects xp above 50', () => {
    const result = DialogueResponseSchema.safeParse({
      npcReply: 'x',
      feedback: { isUnderstandable: true, xpAwarded: 999 },
    });
    expect(result.success).toBe(false);
  });
});
