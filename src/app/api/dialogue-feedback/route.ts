import 'server-only';
import { NextResponse } from 'next/server';
import type { DialogueFeedback } from '@/types/game';
import { DialogueRequestSchema } from '@/lib/dialogue/schema';
import { evaluateDialogueWithAnthropic } from '@/lib/dialogue/anthropic';
import { clientIdentifier, dialogueRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const errorResponse = (error: string, code: string, status: number, extra?: Record<string, unknown>) =>
  NextResponse.json({ error, code, ...extra }, { status });

export const deterministicFeedback = (userText: string): { npcReply: string; feedback: DialogueFeedback } => {
  const normalized = userText.toLowerCase();

  if (normalized.includes('hora')) {
    return {
      npcReply: 'Llegué a casa a las 22:30, más o menos.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation: 'Buena pregunta de tiempo para una investigación.',
      },
    };
  }

  if (normalized.includes('sola')) {
    return {
      npcReply: 'Sí, estaba sola en casa.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation: 'Pregunta clara sobre una posible coartada.',
      },
    };
  }

  return {
    npcReply: 'No estoy segura de entenderte, detective.',
    feedback: {
      isUnderstandable: false,
      xpAwarded: 3,
      suggestedCorrection: '¿Puedes repetirlo con más detalle?',
      explanation: 'Intenta usar una pregunta más específica en español.',
    },
  };
};

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  const parsed = DialogueRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse('Request failed validation', 'INVALID_REQUEST', 400, {
      issues: parsed.error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
    });
  }

  const identifier = clientIdentifier(request);
  const limit = await dialogueRateLimit(identifier);
  if (!limit.success) {
    return errorResponse('Rate limit exceeded', 'RATE_LIMITED', 429, {
      retryAfterMs: Math.max(0, limit.reset - Date.now()),
    });
  }

  const body = parsed.data;
  const aiApiKey = process.env.AI_API_KEY;

  if (!aiApiKey) {
    return NextResponse.json(deterministicFeedback(body.userText));
  }

  try {
    const response = await evaluateDialogueWithAnthropic(body);
    return NextResponse.json(response);
  } catch (err) {
    logger.error({ err, npcId: body.npcId, caseId: body.caseId }, 'AI dialogue evaluation failed');
    return NextResponse.json(deterministicFeedback(body.userText));
  }
}
