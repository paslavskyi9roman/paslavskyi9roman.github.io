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
  /** Short prose shown when the player examines the hotspot, before they commit it to the journal. */
  examinePrompt: string;
  examinePromptEn: string;
  /** Optional preconditions: the hotspot is hidden until all listed clues/statements are present. */
  requires?: {
    clueIds?: string[];
    statementIds?: string[];
  };
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
  npc_mercedes_quintero: {
    id: 'npc_mercedes_quintero',
    roleEn: "Ramón's sister · newspaper vendor",
    openingEn:
      "Detective… I was expecting you. I knew sooner or later you'd trace the phone. I just… I wanted to do what my brother would have done. Make the call. Say what I saw. Even with my hands shaking.",
    tagline: 'Hermana de Ramón. La voz de la cabina.',
    taglineEn: "Ramón's sister. The voice from the phone box.",
    portrait: '/assets/characters/npc_mercedes_quintero.png',
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
      aEn: "Plain enough, then: I didn't leave the house. Nothing more, detective. Shall I go on?",
      correction: {
        from: 'No entiendo.',
        to: 'No lo entiendo.',
        note: 'Añadir «lo» suena más natural en español peninsular.',
      },
    },
    'Su recibo dice 23:48. Explíquelo.': {
      q: 'Su recibo dice 23:48. Explíquelo.',
      qEn: 'Your receipt says 23:48. Explain.',
      aEn: "Well… I went back for a moment, yes. For my bag — I'd forgotten it. I didn't mention it because it didn't seem important. Five minutes, detective. Five. Then home.",
      statementValueEn: 'Lucía revised her account: claims she briefly returned to the bar at 23:48',
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
      aEn: "Tall, grey hair, well-kept hands — hands that don't chop firewood. Signet ring on the little finger. Hotel cologne, not the local barber's eau de toilette. The suit wasn't from around here. He left something on the bar before he went out — but until you find it yourself, detective, I'd rather not point at it.",
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
    examinePrompt:
      'Una hoja arrugada asoma bajo el cenicero. La letra es apresurada — alguien escribió esto a oscuras.',
    examinePromptEn:
      'A crumpled scrap pokes out from under the ashtray. The handwriting is hurried — someone wrote this in the dark.',
    x: 22,
    y: 78,
  },
  {
    id: 'clue_receipt',
    title: 'Recibo del bar',
    titleEn: 'Bar receipt',
    description: '23:48 · 2× vermú · firma: L. Vargas',
    descriptionEn: '23:48 · 2× vermouth · signed: L. Vargas',
    examinePrompt: 'Un recibo pegado al borde de la barra. La hora coincide con el último servicio de la noche.',
    examinePromptEn: 'A receipt stuck to the edge of the counter. The time matches the last round of the night.',
    x: 76,
    y: 35,
  },
  {
    id: 'clue_glass',
    title: 'Vaso con huellas',
    titleEn: 'Glass with prints',
    description: 'Carmín rojo en el borde — junto al cuerpo.',
    descriptionEn: 'Red carmine on the rim — beside the body.',
    examinePrompt: 'Un vaso solitario junto al cuerpo. Un beso de carmín rojo en el borde — y no es el de Lucía.',
    examinePromptEn: "A lone glass beside the body. A kiss of red carmine on the rim — and it isn't Lucía's shade.",
    x: 48,
    y: 88,
  },
  {
    id: 'clue_matchbook',
    title: 'Caja de cerillas',
    titleEn: 'Matchbook',
    description: '«Hotel Atocha». Tres cerillas usadas.',
    descriptionEn: '"Hotel Atocha". Three matches used.',
    examinePrompt: 'Una caja de cerillas con el sello del Hotel Atocha. Tres cerillas ya quemadas.',
    examinePromptEn: "A matchbook stamped with the Hotel Atocha's seal. Three matches already burned.",
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

/**
 * English translations for each lesson capsule (title + tip). Consumed by
 * the CaseFile so hover-translate works on the right-hand sidebar.
 */
export const LESSON_BILINGUAL: Record<string, { title: string; tip: string }> = {
  l1: {
    title: 'Time questions',
    tip: 'Use "¿A qué hora...?" to detect inconsistencies.',
  },
  l2: {
    title: 'Natural clarity',
    tip: '"No lo entiendo" sounds more natural than "No entiendo".',
  },
  l3: {
    title: 'Police vocabulary',
    tip: 'Practice: testigo, coartada, pista, declaración.',
  },
  l4: {
    title: 'Preterite for closed facts',
    tip: '"Vi", "hablé", "encontré" sound like an official report. The imperfect sounds like doubt.',
  },
  l5: {
    title: 'Forensic vocabulary',
    tip: 'Learn: ceniza, filtro, carmín, huella, cabina, centralita.',
  },
  l6: {
    title: 'Chronology before motive',
    tip: 'Time, place, company — in that order. The cracks appear on their own.',
  },
};

/**
 * English translations for each quest's title and objective. Consumed by the
 * DetectiveNotebook so the player can hover any quest line to read the
 * meaning while staying immersed in Spanish.
 */
export const QUEST_BILINGUAL: Record<string, { title: string; objective: string }> = {
  q1: {
    title: 'Verify the alibi',
    objective: 'Talk to Lucía and uncover a timeline contradiction.',
  },
  q2: {
    title: 'Reconstruct the route',
    objective: 'Find 2 physical clues at the scene.',
  },
  q3: {
    title: 'Chain of witnesses',
    objective: "Question the bartender and cross-check his statement with Lucía's.",
  },
  q4: {
    title: 'Search the apartment',
    objective: "Find at least 2 physical clues in Lucía's flat.",
  },
  q5: {
    title: 'Weave the contradictions',
    objective: 'Provoke at least one new contradiction while questioning Lucía at her flat.',
  },
  q6: {
    title: 'Locate the witness',
    objective: 'Find at least 2 clues at the Argumosa newsstand.',
  },
  q7: {
    title: 'Take her statement',
    objective: 'Record at least one statement from Mercedes Quintero.',
  },
  q8: {
    title: 'Close the circle',
    objective: 'Provoke at least one new contradiction against Lucía here.',
  },
};

export const CASE_001_TICKER: string[] = [
  '★ Periodista hallado muerto en Lavapiés',
  '★ La Brigada Nocturna pide colaboración ciudadana',
  '★ Gran Vía cerrada por inundaciones',
  '★ Lluvia persistente — temperatura 9°',
];
