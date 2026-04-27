import { z } from 'zod';

export const DialogueMessageSchema = z.object({
  speaker: z.enum(['npc', 'player', 'system']),
  text: z.string().min(1).max(2000),
  timestamp: z.number().int().nonnegative(),
  npcId: z.string().min(1).max(120).optional(),
  npcName: z.string().min(1).max(120).optional(),
});

export const DialogueFeedbackSchema = z.object({
  isUnderstandable: z.boolean(),
  xpAwarded: z.number().int().min(0).max(50),
  suggestedCorrection: z.string().min(1).max(500).optional(),
  explanation: z.string().min(1).max(1000).optional(),
});

export const DialogueRequestSchema = z.object({
  userText: z.string().trim().min(1).max(500),
  npcId: z.string().min(1).max(120),
  caseId: z.string().min(1).max(120),
  dialogueContext: z.array(DialogueMessageSchema).max(50),
});

export const DialogueResponseSchema = z.object({
  npcReply: z.string().min(1).max(800),
  feedback: DialogueFeedbackSchema,
});

export type DialogueRequest = z.infer<typeof DialogueRequestSchema>;
export type DialogueResponse = z.infer<typeof DialogueResponseSchema>;
