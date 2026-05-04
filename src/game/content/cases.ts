import type {
  BilingualNpc,
  BilingualReply,
  BilingualText,
  SceneClue,
  VictimRecord,
  VocabularyEntry,
} from './case001-bilingual';
import {
  CASE_001_BILINGUAL_NPCS,
  CASE_001_BILINGUAL_REPLIES,
  CASE_001_DATE,
  CASE_001_HEADLINE,
  CASE_001_SCENE_CLUES,
  CASE_001_TICKER,
  CASE_001_VICTIM,
  CASE_001_VOCABULARY,
  LESSON_BILINGUAL as CASE_001_LESSON_BILINGUAL,
  QUEST_BILINGUAL as CASE_001_QUEST_BILINGUAL,
} from './case001-bilingual';
import {
  CASE_001_CLUE_CONTRADICTIONS,
  CASE_001_CULPRIT,
  CASE_001_LESSONS,
  CASE_001_NPCS,
  CASE_001_QUESTS,
  NPC_OUTCOMES,
} from './case001';
import {
  APARTMENT_CLUE_CONTRADICTIONS,
  APARTMENT_NPC_OUTCOMES,
  APARTMENT_NPC_PROFILES,
  APARTMENT_QUESTS,
} from './case001-apartment';
import {
  APARTMENT_BILINGUAL_NPCS,
  APARTMENT_BILINGUAL_REPLIES,
  APARTMENT_SCENE_CLUES,
} from './case001-apartment-bilingual';
import {
  ARGUMOSA_CLUE_CONTRADICTIONS,
  ARGUMOSA_NPC_OUTCOMES,
  ARGUMOSA_NPC_PROFILES,
  ARGUMOSA_QUICK_REPLY_CLUE_GATES,
  ARGUMOSA_QUESTS,
} from './case001-argumosa';
import {
  ARGUMOSA_BILINGUAL_NPCS,
  ARGUMOSA_BILINGUAL_REPLIES,
  ARGUMOSA_SCENE_CLUES,
} from './case001-argumosa-bilingual';
import { CASE_001_QUICK_REPLY_CLUE_GATES } from './case001';
import {
  LOCATIONS as CASE_001_LOCATIONS,
  LOCATION_ORDER as CASE_001_LOCATION_ORDER,
  LOCATION_REQUIRED_QUESTS as CASE_001_LOCATION_REQUIRED_QUESTS,
} from './locations';
import type { DialogueFeedback, Lesson, NpcProfile, Quest, LocationId } from '@/types/game';

export type ReplyOutcome = {
  reply: string;
  feedback: DialogueFeedback;
  xpType: 'investigation' | 'grammar' | 'vocabulary';
  statement?: { id: string; topic: string; value: string };
};

export interface LocationDef {
  id: LocationId;
  name: BilingualText;
  address: BilingualText;
  background: string;
  caption: BilingualText;
  kicker: BilingualText;
  byline: BilingualText;
  alt: BilingualText;
  handwritten?: string;
}

export interface CaseDefinition {
  id: string;
  number: string;
  title: BilingualText;
  date: string;
  ticker: string[];
  menu: {
    eyebrow: string;
    summary: string;
    meta: string[];
  };
  briefing: {
    kicker: string;
    title: BilingualText;
    paragraphs: BilingualText[];
    instructions: string[];
    signature: string;
  };
  victim: VictimRecord & { portrait: string };
  culprit: string;
  requiredCluesForAccusation: number;
  accusation: {
    requiredClueIds?: string[];
    solvedXp: number;
    failedXp: number;
    finalQuestId?: string;
  };
  locations: Record<LocationId, LocationDef>;
  locationOrder: LocationId[];
  defaultLocationId: LocationId;
  locationRequiredQuests: Record<LocationId, string[]>;
  locationNpcIds: Record<LocationId, string[]>;
  locationNpcOverrides?: Record<LocationId, Record<string, Pick<NpcProfile, 'openingLine' | 'quickReplies'>>>;
  npcs: NpcProfile[];
  bilingualNpcs: Record<string, BilingualNpc>;
  bilingualNpcOverrides?: Record<LocationId, Record<string, Partial<BilingualNpc>>>;
  quests: Quest[];
  questBilingual: Record<string, { title: string; objective: string }>;
  lessons: Lesson[];
  lessonBilingual: Record<string, { title: string; tip: string }>;
  vocabulary: VocabularyEntry[];
  sceneCluesByLocation: Record<LocationId, SceneClue[]>;
  outcomes: Record<string, Record<string, ReplyOutcome>>;
  bilingualReplies: Record<string, Record<string, BilingualReply>>;
  quickReplyClueGates: Record<string, Record<string, string>>;
  clueContradictions: Record<string, string[]>;
  clueQuestRules: Array<{ locationId: LocationId; questId: string; minClues?: number; clueIds?: string[] }>;
  dialogueQuestRules: Array<{
    locationId?: LocationId;
    npcId?: string;
    replyText?: string;
    statementId?: string;
    questId: string;
    requiredClueIds?: string[];
  }>;
  contradictionQuestRules: Array<{
    locationId?: LocationId;
    clueIds?: string[];
    statementIds?: string[];
    questId: string;
  }>;
}

const mergeRecord = <T>(...maps: Array<Record<string, T>>): Record<string, T> => {
  const out: Record<string, T> = {};
  for (const map of maps) Object.assign(out, map);
  return out;
};

const mergeNested = <T>(...maps: Array<Record<string, Record<string, T>>>): Record<string, Record<string, T>> => {
  const out: Record<string, Record<string, T>> = {};
  for (const map of maps) {
    for (const [id, values] of Object.entries(map)) {
      out[id] = { ...(out[id] ?? {}), ...values };
    }
  }
  return out;
};

const case001Locations: Record<LocationId, LocationDef> = Object.fromEntries(
  Object.values(CASE_001_LOCATIONS).map((loc) => [
    loc.id,
    {
      ...loc,
      alt: loc.name,
      handwritten:
        loc.id === 'bar_interior' ? 'examinar ->' : loc.id === 'lucia_apartment' ? 'registrar ->' : 'rastrear ->',
    },
  ]),
);

const CASE_001: CaseDefinition = {
  id: 'case_001',
  number: '001',
  title: CASE_001_HEADLINE,
  date: CASE_001_DATE,
  ticker: CASE_001_TICKER,
  menu: {
    eyebrow: 'Caso 001',
    summary: 'Un periodista muerto. Tres testigos. Cuatro pistas. Lo que tú digas, en español, decide la sentencia.',
    meta: ['Tiempo medio: 25-40 min', 'Nivel: intermedio (A2-B1)', 'Idiomas: ES (con ayuda EN)'],
  },
  briefing: {
    kicker: 'Telegrama urgente · Jefatura Superior · Madrid',
    title: CASE_001_HEADLINE,
    paragraphs: [
      {
        es: 'MADRID, 14·X·1953. Antes del amanecer, el cuerpo del periodista Ramón Quintero apareció en el callejón tras la Taberna La Sirena, en pleno barrio de Lavapiés.',
        en: 'MADRID, 14 Oct. 1953. Before dawn, reporter Ramón Quintero was found dead in the alley behind Taberna La Sirena.',
      },
      {
        es: 'Tres testigos. Cuatro pistas físicas. Una coartada que no encaja con la hora. Su trabajo: hablar en español claro, recoger contradicciones y formular la acusación formal.',
        en: 'Three witnesses. Four physical clues. An alibi that does not fit the time. Your job is to speak clear Spanish, collect contradictions, and make the formal accusation.',
      },
    ],
    instructions: [
      'Habla con los testigos. Empieza por hora, lugar y compañía.',
      'Examina la escena. Cada punto rojo del plano oculta una pista.',
      'Las pistas físicas nunca mienten — pero los testigos sí.',
      'Cuando aparezca el sello LISTO PARA ACUSAR, pulsa Acusar.',
    ],
    signature: 'firmado · Insp. M. Ruiz, Brigada Criminal',
  },
  victim: { ...CASE_001_VICTIM, portrait: '/assets/characters/npc_ramon_quintero.png' },
  culprit: CASE_001_CULPRIT,
  requiredCluesForAccusation: 3,
  accusation: { solvedXp: 25, failedXp: 5 },
  locations: case001Locations,
  locationOrder: CASE_001_LOCATION_ORDER,
  defaultLocationId: 'bar_interior',
  locationRequiredQuests: CASE_001_LOCATION_REQUIRED_QUESTS,
  locationNpcIds: {
    bar_interior: ['npc_lucia_vargas', 'npc_diego_torres', 'npc_inspectora_ruiz'],
    lucia_apartment: ['npc_lucia_vargas', 'npc_inspectora_ruiz'],
    argumosa_kiosk: ['npc_mercedes_quintero', 'npc_inspectora_ruiz'],
  },
  locationNpcOverrides: {
    lucia_apartment: APARTMENT_NPC_PROFILES,
    argumosa_kiosk: ARGUMOSA_NPC_PROFILES,
  },
  npcs: CASE_001_NPCS,
  bilingualNpcs: CASE_001_BILINGUAL_NPCS,
  bilingualNpcOverrides: {
    lucia_apartment: APARTMENT_BILINGUAL_NPCS,
    argumosa_kiosk: ARGUMOSA_BILINGUAL_NPCS,
  },
  quests: [...CASE_001_QUESTS, ...APARTMENT_QUESTS, ...ARGUMOSA_QUESTS],
  questBilingual: CASE_001_QUEST_BILINGUAL,
  lessons: CASE_001_LESSONS,
  lessonBilingual: CASE_001_LESSON_BILINGUAL,
  vocabulary: CASE_001_VOCABULARY,
  sceneCluesByLocation: {
    bar_interior: CASE_001_SCENE_CLUES,
    lucia_apartment: APARTMENT_SCENE_CLUES,
    argumosa_kiosk: ARGUMOSA_SCENE_CLUES,
  },
  outcomes: mergeNested(NPC_OUTCOMES, APARTMENT_NPC_OUTCOMES, ARGUMOSA_NPC_OUTCOMES),
  bilingualReplies: mergeNested(CASE_001_BILINGUAL_REPLIES, APARTMENT_BILINGUAL_REPLIES, ARGUMOSA_BILINGUAL_REPLIES),
  quickReplyClueGates: mergeNested(CASE_001_QUICK_REPLY_CLUE_GATES, ARGUMOSA_QUICK_REPLY_CLUE_GATES),
  clueContradictions: mergeRecord(
    CASE_001_CLUE_CONTRADICTIONS,
    APARTMENT_CLUE_CONTRADICTIONS,
    ARGUMOSA_CLUE_CONTRADICTIONS,
  ),
  clueQuestRules: [
    { locationId: 'bar_interior', questId: 'q2', minClues: 2 },
    { locationId: 'lucia_apartment', questId: 'q4', minClues: 2 },
    { locationId: 'argumosa_kiosk', questId: 'q6', minClues: 2 },
  ],
  dialogueQuestRules: [
    { npcId: 'npc_lucia_vargas', replyText: '¿A qué hora llegaste a casa?', questId: 'q1' },
    { npcId: 'npc_diego_torres', replyText: '¿Quién pagó la última ronda?', questId: 'q3' },
    { locationId: 'argumosa_kiosk', npcId: 'npc_mercedes_quintero', questId: 'q7' },
  ],
  contradictionQuestRules: [
    { locationId: 'lucia_apartment', clueIds: Object.keys(APARTMENT_CLUE_CONTRADICTIONS), questId: 'q5' },
    { locationId: 'argumosa_kiosk', clueIds: Object.keys(ARGUMOSA_CLUE_CONTRADICTIONS), questId: 'q8' },
  ],
};

const case002Locations: Record<LocationId, LocationDef> = {
  church_san_cayetano: {
    id: 'church_san_cayetano',
    name: { es: 'Iglesia de San Cayetano', en: 'San Cayetano Church' },
    address: { es: 'Calle de Embajadores 15', en: '15 Calle de Embajadores' },
    background: '/assets/scenes/bg_church_san_cayetano.png',
    caption: {
      es: 'FIG. 1 - Nave lateral de San Cayetano, 07:10. El humo de las velas cubre el altar como una cortina.',
      en: 'FIG. 1 - Side nave of San Cayetano, 07:10. Candle smoke covers the altar like a curtain.',
    },
    kicker: { es: 'La Iglesia', en: 'The Church' },
    byline: { es: 'San Cayetano - Calle de Embajadores 15', en: 'San Cayetano - 15 Calle de Embajadores' },
    alt: { es: 'Interior de San Cayetano', en: 'Interior of San Cayetano' },
    handwritten: 'examinar ->',
  },
  graveyard_san_lorenzo: {
    id: 'graveyard_san_lorenzo',
    name: { es: 'Cementerio de San Lorenzo', en: 'San Lorenzo Graveyard' },
    address: { es: 'Entrada por Calle de la Fe', en: 'Entrance on Calle de la Fe' },
    background: '/assets/scenes/bg_graveyard_san_lorenzo.png',
    caption: {
      es: 'FIG. 2 - Ángel de piedra junto al panteón Valcárcel. La lluvia ha borrado media escena y revelado la otra mitad.',
      en: 'FIG. 2 - Stone angel by the Valcárcel tomb. Rain has erased half the scene and revealed the other half.',
    },
    kicker: { es: 'El Cementerio', en: 'The Graveyard' },
    byline: { es: 'Cementerio de San Lorenzo - Calle de la Fe', en: 'San Lorenzo Graveyard - Calle de la Fe' },
    alt: { es: 'Cementerio con ángel de piedra', en: 'Graveyard with stone angel' },
    handwritten: 'rastrear ->',
  },
  hotel_atocha_archive: {
    id: 'hotel_atocha_archive',
    name: { es: 'Archivo del Hotel Atocha', en: 'Hotel Atocha Archive' },
    address: { es: 'Calle de Atocha 43, sótano', en: '43 Calle de Atocha, basement' },
    background: '/assets/scenes/bg_hotel_atocha_archive.png',
    caption: {
      es: 'FIG. 3 - Libros de huéspedes, recibos y llaves de servicio bajo una bombilla enferma.',
      en: 'FIG. 3 - Guest ledgers, receipts, and service keys under a sickly bulb.',
    },
    kicker: { es: 'El Archivo', en: 'The Archive' },
    byline: { es: 'Hotel Atocha - Calle de Atocha 43', en: 'Hotel Atocha - 43 Calle de Atocha' },
    alt: { es: 'Archivo del Hotel Atocha', en: 'Hotel Atocha archive' },
    handwritten: 'archivar ->',
  },
};

const CASE_002_NPCS: NpcProfile[] = [
  {
    id: 'npc_padre_mateo',
    name: 'Padre Mateo Abril',
    role: 'Párroco de San Cayetano',
    openingLine:
      'Detective, le pido discreción. Esta casa ya ha visto demasiada pena. Eusebio era un buen hombre; si cayó en el cementerio, Dios sabrá por qué lo llamó de esa manera.',
    lessonFocus: 'grammar',
    quickReplies: [
      '¿A qué hora vio a Eusebio por última vez?',
      '¿Quién limpió la sacristía?',
      '¿Quién tiene llave del pasillo lateral?',
      '¿Por qué habla de caída?',
      'Corrija mi frase, padre.',
    ],
  },
  {
    id: 'npc_sor_ines',
    name: 'Sor Inés Villalba',
    role: 'Encargada de cuentas de caridad',
    openingLine:
      'No me gustan las preguntas antes del desayuno, detective, pero me gustan menos los muertos sin justicia. Si pregunta con respeto, contestaré con memoria.',
    lessonFocus: 'vocabulary',
    quickReplies: [
      '¿Oyó voces esta mañana?',
      '¿Qué guardaba Eusebio en el armario?',
      '¿Conocía a Tomás Beltrán?',
      '¿Qué significa panteón?',
      'Repítalo más despacio, por favor.',
    ],
  },
  {
    id: 'npc_arturo_rivas',
    name: 'Arturo Rivas',
    role: 'Sepulturero y cuidador',
    openingLine:
      'Yo entierro muertos, detective; no los fabrico. Ese hombre no cayó donde lo encontraron. Lo sé por el barro, por los zapatos y por el modo en que pesaba la madrugada.',
    lessonFocus: 'investigation',
    quickReplies: [
      '¿Por qué no cayó aquí?',
      '¿Vio a alguien antes del alba?',
      '¿Reconoce este paraguas?',
      '¿Quién abrió la verja este?',
      'Explique lo del barro.',
    ],
  },
  {
    id: 'npc_tomas_beltran',
    name: 'Tomás Beltrán',
    role: 'Recepcionista nocturno del Hotel Atocha',
    openingLine:
      'Detective... el Hotel Atocha coopera siempre con la autoridad. Pero no veo qué puede tener que ver un humilde recepcionista con una desgracia ocurrida entre tumbas.',
    lessonFocus: 'investigation',
    quickReplies: [
      '¿Dónde estuvo entre las cinco y las seis?',
      '¿Conocía a Eusebio Marín?',
      '¿Por qué falta una página del registro?',
      '¿De quién es el paraguas negro?',
      'El certificado dice Valcárcel.',
    ],
  },
  {
    id: 'npc_inspectora_ruiz',
    name: 'Inspectora Ruiz',
    role: 'Mentora policial',
    openingLine:
      'No se deje impresionar por los santos ni por las lápidas. Una escena sagrada sigue siendo una escena, y una mentira dicha en voz baja pesa lo mismo que una gritada.',
    lessonFocus: 'grammar',
    quickReplies: [
      '¿Qué buscamos primero?',
      '¿Cómo distingo caída y golpe?',
      '¿Cuándo puedo acusar?',
      'Resumen del caso, por favor.',
    ],
  },
];

const case002BilingualNpcs: Record<string, BilingualNpc> = {
  npc_padre_mateo: {
    id: 'npc_padre_mateo',
    roleEn: 'Parish priest',
    openingEn: 'Detective, I ask for discretion. This house has already seen too much sorrow.',
    tagline: 'Autoridad protectora. Sabe más de lo que admite.',
    taglineEn: 'Protective authority. Knows more than he admits.',
    portrait: '/assets/characters/npc_padre_mateo.png',
  },
  npc_sor_ines: {
    id: 'npc_sor_ines',
    roleEn: 'Nun managing charity accounts',
    openingEn: 'I dislike questions before breakfast, detective, but I dislike dead men without justice even more.',
    tagline: 'Testigo precisa. Oyó un apellido antes del golpe.',
    taglineEn: 'Precise witness. Heard a surname before the blow.',
    portrait: '/assets/characters/npc_sor_ines.png',
  },
  npc_arturo_rivas: {
    id: 'npc_arturo_rivas',
    roleEn: 'Gravedigger and caretaker',
    openingEn: 'I bury the dead, detective; I do not manufacture them.',
    tagline: 'Lee el barro como otros leen periódicos.',
    taglineEn: 'Reads mud the way others read newspapers.',
    portrait: '/assets/characters/npc_arturo_rivas.png',
  },
  npc_tomas_beltran: {
    id: 'npc_tomas_beltran',
    roleEn: 'Hotel Atocha night clerk',
    openingEn: 'Detective... the Hotel Atocha always cooperates with authority.',
    tagline: 'Cortés, exacto, demasiado preparado.',
    taglineEn: 'Polite, exact, too prepared.',
    portrait: '/assets/characters/npc_tomas_beltran.png',
  },
  npc_inspectora_ruiz: {
    id: 'npc_inspectora_ruiz',
    roleEn: 'Police mentor',
    openingEn: 'Do not be impressed by saints or gravestones. A sacred scene is still a scene.',
    tagline: 'Veterana. Tu enlace en la jefatura.',
    taglineEn: 'Veteran. Your liaison at HQ.',
    portrait: '/assets/characters/npc_inspectora_ruiz.png',
  },
};

const case002Quests: Quest[] = [
  {
    id: 'case002_q1',
    locationId: 'church_san_cayetano',
    title: 'Rompe el silencio',
    objective: 'Encuentra al menos dos pistas físicas dentro de la iglesia.',
    rewardXp: 35,
  },
  {
    id: 'case002_q2',
    locationId: 'church_san_cayetano',
    title: 'La sacristía limpia',
    objective: 'Registra y contradice la declaración de Padre Mateo sobre la sacristía.',
    rewardXp: 45,
  },
  {
    id: 'case002_q3',
    locationId: 'graveyard_san_lorenzo',
    title: 'El muerto no caminó',
    objective: 'Prueba que el cuerpo fue movido con zapatos limpios y barro del cementerio.',
    rewardXp: 40,
  },
  {
    id: 'case002_q4',
    locationId: 'graveyard_san_lorenzo',
    title: 'El apellido borrado',
    objective: 'Encuentra el paquete del ángel e inspecciona la lápida Valcárcel.',
    rewardXp: 45,
  },
  {
    id: 'case002_q5',
    locationId: 'hotel_atocha_archive',
    title: 'Veintitrés minutos',
    objective: 'Encuentra el hueco del libro y desafía la coartada de Tomás.',
    rewardXp: 50,
  },
  {
    id: 'case002_q6',
    locationId: 'hotel_atocha_archive',
    title: 'Acusar al recepcionista',
    objective: 'Acusa a Tomás con tiempo, acceso y objeto.',
    rewardXp: 70,
  },
];

const case002Lessons: Lesson[] = [
  {
    id: 'case002_l1',
    title: 'Pretérito perfecto para pruebas frescas',
    tip: 'Usa “He encontrado...” cuando informes una prueba recién descubierta.',
    xpType: 'grammar',
  },
  {
    id: 'case002_l2',
    title: 'Indefinido para la cronología',
    tip: 'Usa “vio”, “salió”, “abrió” y “golpeó” para hechos cerrados.',
    xpType: 'grammar',
  },
  {
    id: 'case002_l3',
    title: 'Vocabulario de cementerio',
    tip: 'Practica: lápida, panteón, nicho, fosa, verja, barro.',
    xpType: 'vocabulary',
  },
  {
    id: 'case002_l4',
    title: 'Presión educada',
    tip: '“Explíquelo, por favor” suena firme sin sonar descuidado.',
    xpType: 'investigation',
  },
  {
    id: 'case002_l5',
    title: 'Acceso y posesión',
    tip: 'Pregunta “¿Quién tenía llave...?” y “¿De quién es...?” para probar oportunidad.',
    xpType: 'investigation',
  },
];

const case002SceneCluesByLocation: Record<LocationId, SceneClue[]> = {
  church_san_cayetano: [
    {
      id: 'case002_church_clue_wax',
      title: 'Cera negra en la tarima',
      titleEn: 'Black wax on the floorboards',
      description: 'Gotas de cera bajo el altar lateral, lejos de cualquier vela encendida.',
      descriptionEn: 'Drops of wax under the side altar, far from any lit candle.',
      examinePrompt: 'La cera está pisada y mezclada con una hebra de lana negra.',
      examinePromptEn: 'The wax is trampled and mixed with black wool.',
      x: 35,
      y: 66,
    },
    {
      id: 'case002_church_clue_candlestick',
      title: 'Candelabro desaparecido',
      titleEn: 'Missing candlestick',
      description: 'El altar conserva una marca circular donde falta una pieza pesada de latón.',
      descriptionEn: 'The altar keeps a circular mark where a heavy brass piece is missing.',
      examinePrompt: 'El polvo dibuja el contorno de un candelabro gemelo.',
      examinePromptEn: 'Dust outlines the absent twin candlestick.',
      x: 62,
      y: 42,
    },
    {
      id: 'case002_church_clue_bucket',
      title: 'Cubo con agua rosada',
      titleEn: 'Bucket of pink water',
      description: 'Agua jabonosa teñida de sangre diluida, escondida tras la sacristía.',
      descriptionEn: 'Soapy water tinted with diluted blood, hidden behind the sacristy door.',
      examinePrompt: 'El agua huele a lejía. En el borde queda una raya oscura.',
      examinePromptEn: 'The water smells of bleach. A dark line remains on the rim.',
      x: 77,
      y: 72,
    },
    {
      id: 'case002_church_clue_keyhook',
      title: 'Gancho de llaves vacío',
      titleEn: 'Empty key hook',
      description: 'Falta la llave del pasillo lateral que comunica con el cementerio.',
      descriptionEn: 'The key to the side passage into the cemetery is missing.',
      examinePrompt: 'Tres etiquetas, dos llaves. La que falta dice: PASILLO ESTE.',
      examinePromptEn: 'Three tags, two keys. The missing one says EAST PASSAGE.',
      x: 18,
      y: 48,
    },
  ],
  graveyard_san_lorenzo: [
    {
      id: 'case002_grave_clue_clean_shoes',
      title: 'Zapatos limpios',
      titleEn: 'Clean shoes',
      description: 'Las suelas de Eusebio no tienen barro, aunque el suelo junto al ángel está hundido.',
      descriptionEn: "Eusebio's soles have no mud, though the ground by the angel is deep.",
      examinePrompt: 'Si hubiera caminado hasta aquí, llevaría barro hasta los tobillos.',
      examinePromptEn: 'If he had walked here, he would be muddy to the ankles.',
      x: 44,
      y: 76,
    },
    {
      id: 'case002_grave_clue_angel_packet',
      title: 'Paquete bajo el ala del ángel',
      titleEn: "Packet beneath the angel's wing",
      description: 'Tela encerada con copias de certificados parroquiales y nombres tachados.',
      descriptionEn: 'Oilskin with copies of parish certificates and crossed-out names.',
      examinePrompt: 'El ángel tiene una grieta antigua. Dentro, Eusebio escondió papeles.',
      examinePromptEn: 'The angel has an old crack. Inside, Eusebio hid papers.',
      x: 57,
      y: 38,
    },
    {
      id: 'case002_grave_clue_umbrella_mark',
      title: 'Marca de paraguas',
      titleEn: 'Umbrella mark',
      description: 'Un círculo profundo en el barro, con gotas de cera negra alrededor.',
      descriptionEn: 'A deep circle in the mud, with black wax drops around it.',
      examinePrompt: 'No es la marca de un bastón. Es la punta metálica de un paraguas.',
      examinePromptEn: 'Not a cane mark. The metal tip of an umbrella.',
      x: 72,
      y: 68,
    },
    {
      id: 'case002_grave_clue_valcarcel_stone',
      title: 'Lápida Valcárcel raspada',
      titleEn: 'Scraped Valcárcel gravestone',
      description: 'Alguien ha rascado el apellido Valcárcel hasta dejar la piedra blanca.',
      descriptionEn: 'Someone scraped the Valcárcel surname down to white stone.',
      examinePrompt: 'No intentaron borrar una fecha. Intentaron borrar un apellido.',
      examinePromptEn: 'They were not erasing a date. They were erasing a surname.',
      x: 25,
      y: 52,
    },
  ],
  hotel_atocha_archive: [
    {
      id: 'case002_hotel_clue_ledger_gap',
      title: 'Hueco en el libro de noche',
      titleEn: 'Gap in the night ledger',
      description: 'No hay anotaciones entre 05:18 y 05:41, pese a dos huéspedes registrados.',
      descriptionEn: 'No entries between 05:18 and 05:41, despite two registered guests.',
      examinePrompt: 'Veintitrés minutos sin recepcionista en un hotel que presume de exactitud.',
      examinePromptEn: 'Twenty-three minutes without a clerk in a hotel proud of precision.',
      x: 35,
      y: 46,
    },
    {
      id: 'case002_hotel_clue_waxed_umbrella',
      title: 'Paraguas con cera negra',
      titleEn: 'Umbrella with black wax',
      description: 'Paraguas negro del Hotel Atocha, barro seco en la punta y cera en la tela.',
      descriptionEn: 'Black Hotel Atocha umbrella with dry mud on the tip and wax on the cloth.',
      examinePrompt: 'La cera coincide con la del altar lateral. El barro no pertenece a Atocha.',
      examinePromptEn: 'The wax matches the side altar. The mud does not belong to Atocha.',
      x: 78,
      y: 58,
    },
    {
      id: 'case002_hotel_clue_missing_record',
      title: 'Página arrancada',
      titleEn: 'Torn-out page',
      description: 'Falta una hoja del registro de huéspedes de 1939; queda fibra nueva en el corte.',
      descriptionEn: 'A page is missing from the 1939 guest register; fresh fibers remain.',
      examinePrompt: 'La página no envejeció fuera del libro. La arrancaron hace poco.',
      examinePromptEn: 'The page did not age outside the book. It was torn out recently.',
      x: 53,
      y: 30,
    },
    {
      id: 'case002_hotel_clue_service_key',
      title: 'Llave del pasillo este',
      titleEn: 'East passage key',
      description: 'Llave parroquial escondida en una caja de fichas del hotel.',
      descriptionEn: 'A parish key hidden in a hotel file box.',
      examinePrompt: 'La etiqueta dice PASILLO ESTE. Huele a sacristía, no a hotel.',
      examinePromptEn: 'The tag says EAST PASSAGE. It smells of sacristy, not hotel.',
      x: 18,
      y: 70,
    },
  ],
};

const outcome = (
  reply: string,
  xpAwarded: number,
  explanation: string,
  xpType: ReplyOutcome['xpType'],
  statement?: ReplyOutcome['statement'],
): ReplyOutcome => ({
  reply,
  feedback: { isUnderstandable: true, xpAwarded, explanation },
  xpType,
  statement,
});

const CASE_002: CaseDefinition = {
  id: 'case_002',
  number: '002',
  title: { es: 'El Ángel de Piedra', en: 'The Stone Angel' },
  date: 'Madrid · 3 de Noviembre de 1953',
  ticker: ['San Cayetano guarda silencio', 'Hotel Atocha vuelve al expediente', 'Una lápida raspada abre otro nombre'],
  menu: {
    eyebrow: 'Caso 002',
    summary: 'Un sacristán muerto, un ángel roto y un libro de hotel que salta veintitrés minutos.',
    meta: ['Tiempo medio: 35-50 min', 'Nivel: intermedio (A2-B1)', 'Idiomas: ES (con ayuda EN)'],
  },
  briefing: {
    kicker: 'Telegrama urgente · Cementerio de San Lorenzo · Madrid',
    title: { es: 'El Ángel de Piedra', en: 'The Stone Angel' },
    paragraphs: [
      {
        es: 'MADRID, 3·XI·1953. Tras el Día de Difuntos, el sacristán Eusebio Marín apareció muerto junto a un ángel de piedra agrietado.',
        en: 'MADRID, 3 Nov. 1953. After All Souls Day, sacristan Eusebio Marín was found dead beside a cracked stone angel.',
      },
      {
        es: 'El cura habla de caída, el cementerio de profanación y un viejo registro del Hotel Atocha apunta a nombres que alguien quiso enterrar dos veces.',
        en: 'The priest says fall, the cemetery says desecration, and an old Hotel Atocha record points to names someone tried to bury twice.',
      },
    ],
    instructions: [
      'Distingue accidente y homicidio: objeto, lugar, limpieza.',
      'Busca tiempo, acceso y posesión antes de acusar.',
      'Vincula pruebas físicas con declaraciones en el Diario.',
      'El caso no es sobrenatural: el ángel es un escondite.',
    ],
    signature: 'firmado · Insp. M. Ruiz, Brigada Criminal',
  },
  victim: {
    name: 'Eusebio Marín',
    role: { es: 'Sacristán de San Cayetano', en: 'Sacristan of San Cayetano' },
    fate: {
      es: 'Hallado junto al ángel de piedra del Cementerio de San Lorenzo; murió en la sacristía.',
      en: 'Found beside the stone angel in San Lorenzo Graveyard; died in the sacristy.',
    },
    time: 'Entre las 05:20 y 05:35',
    portrait: '/assets/characters/npc_tomas_beltran.png',
  },
  culprit: 'npc_tomas_beltran',
  requiredCluesForAccusation: 3,
  accusation: {
    requiredClueIds: [
      'case002_hotel_clue_ledger_gap',
      'case002_hotel_clue_waxed_umbrella',
      'case002_grave_clue_angel_packet',
    ],
    solvedXp: 25,
    failedXp: 5,
    finalQuestId: 'case002_q6',
  },
  locations: case002Locations,
  locationOrder: ['church_san_cayetano', 'graveyard_san_lorenzo', 'hotel_atocha_archive'],
  defaultLocationId: 'church_san_cayetano',
  locationRequiredQuests: {
    church_san_cayetano: [],
    graveyard_san_lorenzo: ['case002_q1', 'case002_q2'],
    hotel_atocha_archive: ['case002_q3', 'case002_q4'],
  },
  locationNpcIds: {
    church_san_cayetano: ['npc_padre_mateo', 'npc_sor_ines', 'npc_inspectora_ruiz'],
    graveyard_san_lorenzo: ['npc_arturo_rivas', 'npc_inspectora_ruiz'],
    hotel_atocha_archive: ['npc_tomas_beltran', 'npc_inspectora_ruiz'],
  },
  npcs: CASE_002_NPCS,
  bilingualNpcs: case002BilingualNpcs,
  quests: case002Quests,
  questBilingual: {},
  lessons: case002Lessons,
  lessonBilingual: {},
  vocabulary: [
    { es: 'lápida', en: 'gravestone' },
    { es: 'panteón', en: 'family tomb' },
    { es: 'verja', en: 'gate' },
    { es: 'cera', en: 'wax' },
    { es: 'llave', en: 'key' },
    { es: 'registro', en: 'ledger' },
  ],
  sceneCluesByLocation: case002SceneCluesByLocation,
  outcomes: {
    npc_padre_mateo: {
      '¿A qué hora vio a Eusebio por última vez?': outcome(
        'A las cinco menos cuarto. Preparaba las velas para la misa de difuntos. Después supuse que salió al cementerio a rezar por los olvidados.',
        10,
        'Buena pregunta temporal. Sigue la palabra “supuse”.',
        'investigation',
      ),
      '¿Quién limpió la sacristía?': outcome(
        'Nadie la limpió. Quiero decir... se pasa la fregona cada mañana, por costumbre.',
        12,
        'La corrección dentro de la respuesta señala presión.',
        'investigation',
        { id: 'mateo_no_one_cleaned', topic: 'cleanup', value: 'Padre Mateo afirmó que nadie limpió la sacristía' },
      ),
      '¿Quién tiene llave del pasillo lateral?': outcome(
        'El párroco, el sacristán y Sor Inés. Nadie más. Esa puerta se hincha con la humedad y cuesta abrirla incluso con llave.',
        10,
        '“Nadie más” es una declaración fuerte sobre acceso.',
        'vocabulary',
        {
          id: 'mateo_only_clergy_keys',
          topic: 'access',
          value: 'Padre Mateo dijo que solo el clero tenía llaves del pasillo este',
        },
      ),
      '¿Por qué habla de caída?': outcome(
        'Porque estaba junto al ángel, con la piedra rota a su lado. Preferí pensar en una caída antes que en otra cosa.',
        10,
        'Admite una suposición, no una observación.',
        'grammar',
        {
          id: 'mateo_fall_in_graveyard',
          topic: 'cause',
          value: 'Padre Mateo dijo que Eusebio murió tras caer en el cementerio',
        },
      ),
      'Corrija mi frase, padre.': outcome(
        'Si desea sonar formal: “He encontrado sangre diluida en la sacristía.”',
        8,
        'El pretérito perfecto encaja con pruebas recién halladas.',
        'grammar',
      ),
    },
    npc_sor_ines: {
      '¿Oyó voces esta mañana?': outcome(
        'Dos. La de Eusebio y otra más joven, educada. Eusebio dijo un apellido: Valcárcel. Luego cayó algo pesado.',
        14,
        'Testimonio auditivo directo. Abre la pista Valcárcel.',
        'investigation',
        {
          id: 'ines_heard_valcarcel',
          topic: 'sound',
          value: 'Sor Inés oyó a Eusebio decir “Valcárcel” antes del golpe',
        },
      ),
      '¿Qué guardaba Eusebio en el armario?': outcome(
        'Papeles. Copias de bautismos, entierros, dispensas, certificados. Algunos vivos pagaban por ese desorden.',
        11,
        'Introduce vocabulario documental y móvil.',
        'vocabulary',
      ),
      '¿Conocía a Tomás Beltrán?': outcome(
        'De verlo en misa de doce, hace años. Siempre bajo el mismo paraguas negro, siempre al fondo.',
        12,
        'Sitúa a Tomás y su paraguas antes del hotel.',
        'investigation',
      ),
      '¿Qué significa panteón?': outcome(
        'Una tumba familiar, detective. Una casa pequeña para apellidos grandes.',
        8,
        'Vocabulario: panteón, lápida, nicho, fosa.',
        'vocabulary',
      ),
      'Repítalo más despacio, por favor.': outcome(
        'Claro. Oí el apellido Valcárcel. Después, un golpe. Después, silencio.',
        7,
        'Petición cortés y útil para fijar testimonio.',
        'grammar',
      ),
    },
    npc_arturo_rivas: {
      '¿Por qué no cayó aquí?': outcome(
        'Mire sus zapatos. Limpios. Mire mi barro. Profundo. Si hubiera cruzado hasta aquí, llevaría medio cementerio pegado.',
        14,
        'Razonamiento físico por terreno.',
        'investigation',
        {
          id: 'arturo_body_fell_here',
          topic: 'body_location',
          value: 'Arturo aceptó inicialmente que el cuerpo estaba junto al ángel',
        },
      ),
      '¿Vio a alguien antes del alba?': outcome(
        'Un paraguas negro, más que un hombre. Cerca de la verja este.',
        11,
        'El paraguas conecta ruta y objeto.',
        'investigation',
      ),
      '¿Reconoce este paraguas?': outcome(
        'Hotel Atocha. Lo sé por la punta metálica: la reparé en septiembre.',
        12,
        'Identifica el objeto por conocimiento de oficio.',
        'vocabulary',
      ),
      '¿Quién abrió la verja este?': outcome(
        'Yo. Me dieron cinco duros por dejarla sin echar el pasador. No pregunté.',
        12,
        'Admisión de acceso, no de asesinato.',
        'investigation',
        { id: 'arturo_gate_unlocked', topic: 'access', value: 'Arturo dejó la verja este sin cerrar por dinero' },
      ),
      'Explique lo del barro.': outcome(
        'Barro de ciprés: oscuro, pegajoso, con agujas secas. Si lo ve en un paraguas, viene de aquí.',
        10,
        'Detalle forense de terreno.',
        'vocabulary',
      ),
    },
    npc_tomas_beltran: {
      '¿Dónde estuvo entre las cinco y las seis?': outcome(
        'En mi puesto, como cada noche. El hotel no duerme, detective. Puede revisar el libro de guardia.',
        14,
        'Coartada fuerte. El hueco del libro es la contra.',
        'investigation',
        {
          id: 'tomas_at_desk_all_night',
          topic: 'alibi',
          value: 'Tomás dijo no haber dejado el mostrador entre las cinco y las seis',
        },
      ),
      '¿Conocía a Eusebio Marín?': outcome(
        'Conozco de vista a muchos vecinos. Madrid obliga a reconocer caras, no biografías.',
        9,
        'Respuesta evasiva de familiaridad.',
        'grammar',
      ),
      '¿Por qué falta una página del registro?': outcome(
        'Los libros viejos pierden hojas. La humedad, el polvo, los huéspedes borrachos...',
        12,
        'Minimiza una rotura reciente como daño antiguo.',
        'investigation',
        {
          id: 'tomas_records_intact',
          topic: 'records',
          value: 'Tomás aseguró que los registros del hotel están completos',
        },
      ),
      '¿De quién es el paraguas negro?': outcome(
        'Del hotel. Hay tres iguales para clientes respetables. Si apareció en una iglesia, pregunte al cliente.',
        12,
        'Desvía posesión hacia clientes anónimos.',
        'investigation',
        {
          id: 'tomas_no_cemetery',
          topic: 'umbrella',
          value: 'Tomás dijo que el paraguas no lo sitúa en el cementerio',
        },
      ),
      'El certificado dice Valcárcel.': outcome(
        'Ese nombre no significa nada. Madrid está lleno de piedras con apellidos viejos.',
        15,
        'Nombra la piedra antes de que se le diga dónde apareció el certificado.',
        'investigation',
        {
          id: 'tomas_never_heard_valcarcel',
          topic: 'identity',
          value: 'Tomás dijo que el apellido Valcárcel no significa nada para él',
        },
      ),
    },
    npc_inspectora_ruiz: {
      '¿Qué buscamos primero?': outcome(
        'La diferencia entre ceremonia y mecánica. Una vela puede ser símbolo, pero la cera cae según la gravedad.',
        9,
        'Pauta para mirar la escena sin superstición.',
        'investigation',
      ),
      '¿Cómo distingo caída y golpe?': outcome(
        'Una caída deja torpeza alrededor. Un golpe deja intención: objeto que falta, limpieza rápida, herida limpia.',
        10,
        'Contraste útil entre accidente y homicidio.',
        'vocabulary',
      ),
      '¿Cuándo puedo acusar?': outcome(
        'Cuando tenga tres cosas que no dependan del miedo de un testigo: tiempo, acceso y objeto.',
        9,
        'Ledger, llave/paraguas y certificado son la ruta.',
        'investigation',
      ),
      'Resumen del caso, por favor.': outcome(
        'Eusebio murió en la sacristía, no en el cementerio. Mateo limpió por miedo, Arturo abrió por dinero y Tomás quiso enterrar Valcárcel.',
        9,
        'Resumen narrativo del caso.',
        'grammar',
      ),
    },
  },
  bilingualReplies: {},
  quickReplyClueGates: {
    npc_arturo_rivas: { '¿Reconoce este paraguas?': 'case002_grave_clue_umbrella_mark' },
    npc_tomas_beltran: { 'El certificado dice Valcárcel.': 'case002_grave_clue_angel_packet' },
  },
  clueContradictions: {
    case002_church_clue_wax: ['mateo_no_one_cleaned', 'tomas_never_entered_church'],
    case002_church_clue_candlestick: ['mateo_fall_in_graveyard'],
    case002_church_clue_bucket: ['mateo_no_one_cleaned'],
    case002_church_clue_keyhook: ['mateo_only_clergy_keys'],
    case002_grave_clue_clean_shoes: ['mateo_fall_in_graveyard', 'arturo_body_fell_here'],
    case002_grave_clue_angel_packet: ['tomas_never_heard_valcarcel'],
    case002_grave_clue_umbrella_mark: ['tomas_at_desk_all_night'],
    case002_grave_clue_valcarcel_stone: ['tomas_never_heard_valcarcel'],
    case002_hotel_clue_ledger_gap: ['tomas_at_desk_all_night'],
    case002_hotel_clue_waxed_umbrella: ['tomas_no_cemetery', 'tomas_never_entered_church'],
    case002_hotel_clue_missing_record: ['tomas_records_intact'],
    case002_hotel_clue_service_key: ['mateo_only_clergy_keys', 'tomas_never_entered_church'],
  },
  clueQuestRules: [
    { locationId: 'church_san_cayetano', questId: 'case002_q1', minClues: 2 },
    {
      locationId: 'graveyard_san_lorenzo',
      questId: 'case002_q3',
      clueIds: ['case002_grave_clue_clean_shoes', 'case002_grave_clue_umbrella_mark'],
    },
    {
      locationId: 'graveyard_san_lorenzo',
      questId: 'case002_q4',
      clueIds: ['case002_grave_clue_angel_packet', 'case002_grave_clue_valcarcel_stone'],
    },
  ],
  dialogueQuestRules: [
    {
      locationId: 'hotel_atocha_archive',
      npcId: 'npc_tomas_beltran',
      replyText: '¿Dónde estuvo entre las cinco y las seis?',
      questId: 'case002_q5',
      requiredClueIds: ['case002_hotel_clue_ledger_gap'],
    },
  ],
  contradictionQuestRules: [
    { locationId: 'church_san_cayetano', statementIds: ['mateo_no_one_cleaned'], questId: 'case002_q2' },
  ],
};

export const CASES: Record<string, CaseDefinition> = {
  [CASE_001.id]: CASE_001,
  [CASE_002.id]: CASE_002,
};

export const CASE_ORDER = ['case_001', 'case_002'] as const;
export const DEFAULT_CASE_ID = 'case_001';

export const getCaseDefinition = (caseId: string | null | undefined): CaseDefinition => {
  return (caseId && CASES[caseId]) || CASES[DEFAULT_CASE_ID]!;
};

export const getSceneClues = (caseDef: CaseDefinition, locationId: LocationId): SceneClue[] =>
  caseDef.sceneCluesByLocation[locationId] ?? [];

export const getAllSceneClues = (caseDef: CaseDefinition): SceneClue[] =>
  caseDef.locationOrder.flatMap((locationId) => getSceneClues(caseDef, locationId));

export const getBilingualNpcForCase = (
  caseDef: CaseDefinition,
  npcId: string,
  locationId: LocationId,
): BilingualNpc | undefined => {
  const base = caseDef.bilingualNpcs[npcId];
  if (!base) return undefined;
  return { ...base, ...(caseDef.bilingualNpcOverrides?.[locationId]?.[npcId] ?? {}) };
};

export const getStatementValueTranslations = (caseDef: CaseDefinition): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const [npcId, replies] of Object.entries(caseDef.outcomes)) {
    for (const [question, outcome] of Object.entries(replies)) {
      const en = caseDef.bilingualReplies[npcId]?.[question]?.statementValueEn;
      if (outcome.statement && en) map[outcome.statement.id] = en;
    }
  }
  return map;
};
