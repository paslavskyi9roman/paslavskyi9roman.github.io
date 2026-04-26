export interface DialogueMessage {
  speaker: 'npc' | 'player' | 'system';
  text: string;
  timestamp: number;
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
}

export interface DialogueContextPayload {
  userText: string;
  npcId: string;
  caseId: string;
  dialogueContext: DialogueMessage[];
}
