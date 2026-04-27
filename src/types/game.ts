import type { LocationId } from '@/game/content/locations';

export interface DialogueMessage {
  speaker: 'npc' | 'player' | 'system';
  text: string;
  timestamp: number;
  npcId?: string;
  npcName?: string;
}

export interface DialogueFeedback {
  isUnderstandable: boolean;
  suggestedCorrection?: string;
  explanation?: string;
  xpAwarded: number;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
}

export interface NpcProfile {
  id: string;
  name: string;
  openingLine: string;
  role: string;
  lessonFocus: 'vocabulary' | 'grammar' | 'investigation';
  quickReplies: readonly string[];
}

export interface Quest {
  id: string;
  locationId: LocationId;
  title: string;
  objective: string;
  rewardXp: number;
}

export interface Lesson {
  id: string;
  title: string;
  tip: string;
  xpType: 'vocabulary' | 'grammar' | 'investigation';
}

export interface DialogueContextPayload {
  userText: string;
  npcId: string;
  caseId: string;
  dialogueContext: DialogueMessage[];
}

export type CasePhase = 'briefing' | 'investigation' | 'accusation' | 'resolved';
export type CaseResolution = 'solved' | 'failed' | null;

export interface NpcStatement {
  id: string;
  npcId: string;
  topic: string;
  value: string;
  recordedAt: number;
  sourceReply: string;
}

export interface ContradictionRecord {
  id: string;
  clueId: string;
  statementId: string;
  npcId: string;
  detectedAt: number;
}
