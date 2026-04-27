/**
 * Bilingual content extension for Case 001 — keeps the existing
 * gameplay IDs intact while adding the English translations and
 * scene metadata used by the newsprint UI (hover-translate,
 * clickable clue dots on the bar interior, victim file, etc.).
 */

export interface BilingualText {
  es: string;
  en: string;
}

export interface BilingualNpc {
  id: string;
  roleEn: string;
  openingEn: string;
  tagline: string;
  taglineEn: string;
  portrait: string;
}

export interface BilingualReply {
  q: string;
  qEn: string;
  aEn: string;
  statementValueEn?: string;
  correction?: { from: string; to: string; note: string };
}

export interface SceneClue {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  /** Position on the bar interior photograph (0–100, percent). */
  x: number;
  y: number;
}

export interface VictimRecord {
  name: string;
  role: BilingualText;
  fate: BilingualText;
  time: string;
}

export interface VocabularyEntry {
  es: string;
  en: string;
}

export const CASE_001_HEADLINE: BilingualText = {
  es: 'Una Noche en Lavapiés',
  en: 'A Night in Lavapiés',
};

export const CASE_001_DATE = 'Madrid · 14 de Octubre de 1953';

export const CASE_001_VICTIM: VictimRecord = {
  name: 'Ramón Quintero',
  role: { es: 'Periodista del Diario de la Noche', en: 'Reporter, Diario de la Noche' },
  fate: {
    es: 'Hallado muerto en el callejón tras la Taberna La Sirena.',
    en: 'Found dead in the alley behind Taberna La Sirena.',
  },
  time: 'Entre las 23:30 y 00:15',
};

export const CASE_001_BILINGUAL_NPCS: Record<string, BilingualNpc> = {
  npc_lucia_vargas: {
    id: 'npc_lucia_vargas',
    roleEn: 'Prime suspect',
    openingEn: 'I saw nothing that night. I was at home.',
    tagline: 'Cantante de la taberna. Última en verle vivo.',
    taglineEn: 'Tavern singer. Last to see him alive.',
    portrait: '/assets/characters/npc_lucia_vargas.png',
  },
  npc_diego_torres: {
    id: 'npc_diego_torres',
    roleEn: 'Bartender',
    openingEn: 'We close at midnight, but some customers stayed outside.',
    tagline: 'Cierra la barra. Lo ve todo, dice poco.',
    taglineEn: 'Closes the bar. Sees everything, says little.',
    portrait: '/assets/characters/npc_diego_torres.png',
  },
  npc_inspectora_ruiz: {
    id: 'npc_inspectora_ruiz',
    roleEn: 'Police mentor',
    openingEn: 'You must connect witnesses, time, and physical evidence.',
    tagline: 'Veterana. Tu enlace en la jefatura.',
    taglineEn: 'Veteran. Your liaison at HQ.',
    portrait: '/assets/characters/npc_inspectora_ruiz.png',
  },
};

/** Lookup by NPC + Spanish quick-reply text → English translation + correction. */
export const CASE_001_BILINGUAL_REPLIES: Record<string, Record<string, BilingualReply>> = {
  npc_lucia_vargas: {
    '¿Estabas sola?': {
      q: '¿Estabas sola?',
      qEn: 'Were you alone?',
      aEn: 'Yes... alone. My flatmate was traveling.',
      statementValueEn: 'Lucía claims to have been alone at home',
    },
    '¿A qué hora llegaste a casa?': {
      q: '¿A qué hora llegaste a casa?',
      qEn: 'What time did you get home?',
      aEn: 'Around half past ten... I think.',
      statementValueEn: 'Lucía said she arrived at 22:30',
    },
    'No entiendo.': {
      q: 'No entiendo.',
      qEn: "I don't understand.",
      aEn: "I mean I didn't leave the house all night.",
      correction: {
        from: 'No entiendo.',
        to: 'No lo entiendo.',
        note: 'Añadir “lo” suena más natural.',
      },
    },
  },
  npc_diego_torres: {
    '¿Viste a Lucía?': {
      q: '¿Viste a Lucía?',
      qEn: 'Did you see Lucía?',
      aEn: 'Yes, she left quickly and checked her watch repeatedly.',
    },
    '¿Quién pagó la última ronda?': {
      q: '¿Quién pagó la última ronda?',
      qEn: 'Who paid the last round?',
      aEn: 'A man in a grey coat. Not a regular.',
    },
    'Repítelo más despacio.': {
      q: 'Repítelo más despacio.',
      qEn: 'Repeat it more slowly.',
      aEn: 'Sure: Lucía left alone at 23:40.',
    },
  },
  npc_inspectora_ruiz: {
    '¿Qué debo preguntar primero?': {
      q: '¿Qué debo preguntar primero?',
      qEn: 'What should I ask first?',
      aEn: 'Start with time, place, and company. That order reveals cracks.',
    },
    '¿Cómo confirmo una coartada?': {
      q: '¿Cómo confirmo una coartada?',
      qEn: 'How do I confirm an alibi?',
      aEn: 'With witnesses, receipts, and cameras. Never with words alone.',
    },
    '¿Puedes corregir mi frase?': {
      q: '¿Puedes corregir mi frase?',
      qEn: 'Can you correct my sentence?',
      aEn: 'Yes: use past-tense verbs for closed facts.',
    },
  },
};

/** Clickable clue dots laid out over /assets/scenes/bg_bar_interior.png. */
export const CASE_001_SCENE_CLUES: SceneClue[] = [
  {
    id: 'clue_note',
    title: 'Nota arrugada',
    titleEn: 'Crumpled note',
    description: 'Letra apresurada: «Te espero en el callejón, 23:00 — L.»',
    descriptionEn: 'Hurried handwriting: "Meet me in the alley, 23:00 — L."',
    x: 22,
    y: 78,
  },
  {
    id: 'clue_receipt',
    title: 'Recibo del bar',
    titleEn: 'Bar receipt',
    description: '23:48 · 2× vermú · firma: L. Vargas',
    descriptionEn: '23:48 · 2× vermouth · signed: L. Vargas',
    x: 76,
    y: 35,
  },
  {
    id: 'clue_glass',
    title: 'Vaso con huellas',
    titleEn: 'Glass with prints',
    description: 'Carmín rojo en el borde — junto al cuerpo.',
    descriptionEn: 'Red carmine on the rim — beside the body.',
    x: 48,
    y: 88,
  },
  {
    id: 'clue_matchbook',
    title: 'Caja de cerillas',
    titleEn: 'Matchbook',
    description: '«Hotel Atocha». Tres cerillas usadas.',
    descriptionEn: '"Hotel Atocha". Three matches used.',
    x: 14,
    y: 48,
  },
];

export const CASE_001_VOCABULARY: VocabularyEntry[] = [
  { es: 'testigo', en: 'witness' },
  { es: 'coartada', en: 'alibi' },
  { es: 'pista', en: 'clue' },
  { es: 'declaración', en: 'statement' },
  { es: 'sospechoso', en: 'suspect' },
  { es: 'callejón', en: 'alley' },
  { es: 'taberna', en: 'tavern' },
  { es: 'carmín', en: 'red lipstick' },
];

export const CASE_001_QUEST_TRANSLATIONS: Record<string, string> = {
  q1: 'Verify the alibi',
  q2: 'Reconstruct the route',
  q3: 'Chain of witnesses',
};

export const CASE_001_TICKER: string[] = [
  '★ Periodista hallado muerto en Lavapiés',
  '★ La Brigada Nocturna pide colaboración ciudadana',
  '★ Gran Vía cerrada por inundaciones',
  '★ Lluvia persistente — temperatura 9°',
];
