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
    openingEn:
      'I saw nothing that night, detective. I was at home, alone, listening to the radio. If you must ask, ask quickly — the last set is waiting and Don Mauricio docks every minute from my pay.',
    tagline: 'Cantante de la taberna. Última en verle vivo.',
    taglineEn: 'Tavern singer. Last to see him alive.',
    portrait: '/assets/characters/npc_lucia_vargas.png',
  },
  npc_diego_torres: {
    id: 'npc_diego_torres',
    roleEn: 'Bartender',
    openingEn:
      'We close at midnight, but a few customers lingered outside, smoking under the awning. I was drying glasses with one hand and shoving drunks out with the other. Take from that everything and nothing, detective.',
    tagline: 'Cierra la barra. Lo ve todo, dice poco.',
    taglineEn: 'Closes the bar. Sees everything, says little.',
    portrait: '/assets/characters/npc_diego_torres.png',
  },
  npc_inspectora_ruiz: {
    id: 'npc_inspectora_ruiz',
    roleEn: 'Police mentor',
    openingEn:
      "You must connect witnesses, time, and physical evidence. Every alibi breaks at its weakest link; your job isn't to smash it with a hammer — it's to find the crack and blow gently until it opens.",
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
      aEn: "Yes… completely alone. My flatmate Pilar has been in Salamanca caring for her mother since Monday. I don't expect visitors and I don't receive them: the doorwoman can confirm it — she grumbles even at carrying the milk upstairs.",
      statementValueEn: 'Lucía claims to have been alone at home',
    },
    '¿A qué hora llegaste a casa?': {
      q: '¿A qué hora llegaste a casa?',
      qEn: 'What time did you get home?',
      aEn: 'Around half past ten… I think. I crossed the Plaza de Lavapiés, bought tobacco from the night watchman, and climbed three flights without turning on the light. After that, nothing: the national radio, a cup of linden tea, and to bed before eleven sharp.',
      statementValueEn: 'Lucía said she arrived at 22:30',
    },
    '¿Qué cantaste esa noche?': {
      q: '¿Qué cantaste esa noche?',
      qEn: 'What did you sing that night?',
      aEn: '"Ojos verdes" and "La hija de don Juan Alba". The room was packed, even the walls were sweating. When you sing, detective, you don\'t think of anyone else — not what\'s happening outside, not what\'s owed at the bar.',
    },
    '¿Conocías al periodista?': {
      q: '¿Conocías al periodista?',
      qEn: 'Did you know the journalist?',
      aEn: 'We crossed paths. Ramón came some nights to take notes — asking about songs, about the regulars. I poured him vermouth; he served me silence when he got too pushy. Nothing more, detective. Nothing more.',
    },
    'No entiendo.': {
      q: 'No entiendo.',
      qEn: "I don't understand.",
      aEn: "I mean I didn't leave the house all night. Not for the tobacco shop, not for bread, not to greet a neighbor. That's what I mean, detective — write it down word for word, and have me sign it.",
      correction: {
        from: 'No entiendo.',
        to: 'No lo entiendo.',
        note: 'Añadir «lo» suena más natural en español peninsular.',
      },
    },
  },
  npc_diego_torres: {
    '¿Viste a Lucía?': {
      q: '¿Viste a Lucía?',
      qEn: 'Did you see Lucía?',
      aEn: 'Yes, I saw her leave in a hurry. She checked the wall clock two or three times before going, like someone who has an appointment and dreads it. She grabbed her coat off the rack, said goodbye to nobody, and went out through the alley door instead of the street.',
    },
    '¿Quién pagó la última ronda?': {
      q: '¿Quién pagó la última ronda?',
      qEn: 'Who paid the last round?',
      aEn: 'A man in a grey coat, suit cut by a tailor — not one of ours. He paid for two vermouths and a strong coffee, left a tip in large coins, and went out through the alley door. He smelled of hotel cologne, not neighborhood barber.',
    },
    '¿Hubo discusiones esa noche?': {
      q: '¿Hubo discusiones esa noche?',
      qEn: 'Were there any arguments that night?',
      aEn: "One, at the back table: Ramón Quintero and a gentleman I'd never seen before. Low voices, raised fingers. When I came over with the seltzer, both fell silent at the same time. That kind of silence isn't served, detective; it's bought.",
    },
    'Describe al hombre del abrigo gris.': {
      q: 'Describe al hombre del abrigo gris.',
      qEn: 'Describe the man in the grey coat.',
      aEn: "Tall, grey hair, well-kept hands — hands that don't chop firewood. Signet ring on the little finger. Hotel cologne, not barber's eau de toilette. The matchbook he left on the bar was from the Hotel Atocha. That, detective, is no longer coincidence.",
    },
    'Repítelo más despacio.': {
      q: 'Repítelo más despacio.',
      qEn: 'Repeat it more slowly.',
      aEn: 'Sure, no rush: Lu-cí-a left a-lone at e-le-ven for-ty. I checked the wall clock to be sure. I file it in my head just in case, detective; in this trade, minutes weigh more than banknotes.',
    },
  },
  npc_inspectora_ruiz: {
    '¿Qué debo preguntar primero?': {
      q: '¿Qué debo preguntar primero?',
      qEn: 'What should I ask first?',
      aEn: 'Start with the time, then the place, and finish with the company. That order reveals cracks: nobody invents all three at once without contradicting themselves on at least one. Write it in your notebook: chronology before motive.',
    },
    '¿Cómo confirmo una coartada?': {
      q: '¿Cómo confirmo una coartada?',
      qEn: 'How do I confirm an alibi?',
      aEn: 'With cross-checked witnesses, stamped receipts, and awake night watchmen. Never with words alone: a statement without paper behind it evaporates before trial. And if someone offers themselves as a witness too quickly, double your suspicion.',
    },
    '¿Tomamos huellas en el callejón?': {
      q: '¿Tomamos huellas en el callejón?',
      qEn: 'Did we lift prints from the alley?',
      aEn: "We lifted them at dawn, before the neighborhood woke up. We have three partial sets: two match regulars at the bar; the third is from a man with a large hand and a ring on the little finger. That's the one we want.",
    },
    '¿Quién avisó a la policía?': {
      q: '¿Quién avisó a la policía?',
      qEn: 'Who called the police?',
      aEn: 'An anonymous woman from the public phone on Calle Argumosa. Young voice, southern accent. She hung up before giving a name. The switchboard logged it at zero hours and seven minutes. If you find that woman, you find someone who saw.',
    },
    '¿Puedes corregir mi frase?': {
      q: '¿Puedes corregir mi frase?',
      qEn: 'Can you correct my sentence?',
      aEn: 'Of course: use the simple past for closed facts — "I saw", "I spoke", "I found". The imperfect ("I was seeing", "I was speaking") sounds like doubt, and doubt does not convict. Speak like someone signing an official report.',
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
