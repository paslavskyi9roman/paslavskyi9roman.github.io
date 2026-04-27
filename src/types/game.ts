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
