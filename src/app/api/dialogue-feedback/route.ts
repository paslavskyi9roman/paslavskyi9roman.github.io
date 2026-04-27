import { NextResponse } from 'next/server';
import { DialogueContextPayload, DialogueFeedback } from '@/types/game';

const errorResponse = (error: string, code: string, status: number) =>
  NextResponse.json(
    {
      error,
      code,
    },
    { status },
  );

const deterministicFeedback = (userText: string): { npcReply: string; feedback: DialogueFeedback } => {
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
  let body: DialogueContextPayload;
  try {
    body = (await request.json()) as DialogueContextPayload;
  } catch {
    return errorResponse('Invalid JSON body', 'INVALID_JSON', 400);
  }

  if (!body?.userText || !body?.npcId || !body?.caseId) {
    return errorResponse('Missing required fields', 'INVALID_REQUEST', 400);
  }

  const aiApiKey = process.env.AI_API_KEY;

  if (!aiApiKey) {
    return NextResponse.json(deterministicFeedback(body.userText));
  }

  // Placeholder when an OpenAI-compatible provider key is available.
  // Keep server-side only; do not expose provider credentials to the browser.
  // NEEDS VERIFICATION: exact SDK/client wiring based on selected provider package.
  return NextResponse.json({
    npcReply: 'Implementación AI pendiente.',
    feedback: {
      isUnderstandable: true,
      xpAwarded: 0,
      explanation: 'AI provider key detected; endpoint integration still pending implementation.',
    },
  });
}
