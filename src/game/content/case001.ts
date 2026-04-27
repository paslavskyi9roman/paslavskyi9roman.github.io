import { type DialogueFeedback, type Lesson, type NpcProfile, type Quest } from '@/types/game';

type ReplyOutcome = {
  reply: string;
  feedback: DialogueFeedback;
  xpType: 'investigation' | 'grammar' | 'vocabulary';
};

export const CASE_001_NPCS: NpcProfile[] = [
  {
    id: 'npc_lucia_vargas',
    name: 'Lucía Vargas',
    role: 'Sospechosa principal',
    openingLine: 'No vi nada esa noche. Estaba en casa.',
    lessonFocus: 'investigation',
    quickReplies: ['¿Estabas sola?', '¿A qué hora llegaste a casa?', 'No entiendo.'],
  },
  {
    id: 'npc_diego_torres',
    name: 'Diego Torres',
    role: 'Camarero del bar',
    openingLine: 'Cerramos a medianoche, pero algunos clientes se quedaron fuera.',
    lessonFocus: 'vocabulary',
    quickReplies: ['¿Viste a Lucía?', '¿Quién pagó la última ronda?', 'Repítelo más despacio.'],
  },
  {
    id: 'npc_inspectora_ruiz',
    name: 'Inspectora Ruiz',
    role: 'Mentora policial',
    openingLine: 'Tienes que conectar testigos, tiempo y pruebas físicas.',
    lessonFocus: 'grammar',
    quickReplies: ['¿Qué debo preguntar primero?', '¿Cómo confirmo una coartada?', '¿Puedes corregir mi frase?'],
  },
];

export const CASE_001_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Verifica la coartada',
    objective: 'Habla con Lucía y detecta una contradicción horaria.',
    rewardXp: 30,
  },
  { id: 'q2', title: 'Reconstruye la ruta', objective: 'Encuentra 2 pistas físicas en la escena.', rewardXp: 35 },
  {
    id: 'q3',
    title: 'Cadena de testimonios',
    objective: 'Interroga al camarero y cruza su declaración con la de Lucía.',
    rewardXp: 40,
  },
];

export const CASE_001_ROUTE_QUEST_REQUIRED_CLUES = 2;

export const CASE_001_LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Preguntas de tiempo',
    tip: 'Usa “¿A qué hora...?” para detectar incoherencias.',
    xpType: 'investigation',
  },
  {
    id: 'l2',
    title: 'Claridad natural',
    tip: '“No lo entiendo” suena más natural que “No entiendo”.',
    xpType: 'grammar',
  },
  {
    id: 'l3',
    title: 'Vocabulario policial',
    tip: 'Practica: testigo, coartada, pista, declaración.',
    xpType: 'vocabulary',
  },
];

export const NPC_OUTCOMES: Record<string, Record<string, ReplyOutcome>> = {
  npc_lucia_vargas: {
    '¿Estabas sola?': {
      reply: 'Sí... sola. Mi compañera de piso estaba de viaje.',
      feedback: { isUnderstandable: true, xpAwarded: 8, explanation: 'Buena pregunta para verificar coartadas.' },
      xpType: 'investigation',
    },
    '¿A qué hora llegaste a casa?': {
      reply: 'Sobre las diez y media... creo.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation: 'Excelente enfoque temporal para detectar contradicciones.',
      },
      xpType: 'investigation',
    },
    'No entiendo.': {
      reply: 'Quiero decir que no salí de casa en toda la noche.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 4,
        suggestedCorrection: 'No lo entiendo.',
        explanation: 'Añadir "lo" suena más natural en este contexto.',
      },
      xpType: 'grammar',
    },
  },
  npc_diego_torres: {
    '¿Viste a Lucía?': {
      reply: 'Sí, salió rápido y miró su móvil varias veces.',
      feedback: { isUnderstandable: true, xpAwarded: 9, explanation: 'Pregunta directa que produce detalle útil.' },
      xpType: 'investigation',
    },
    '¿Quién pagó la última ronda?': {
      reply: 'Un hombre con abrigo gris. No era cliente habitual.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 11,
        explanation: 'Excelente: detalles de transacción aportan nueva pista.',
      },
      xpType: 'vocabulary',
    },
    'Repítelo más despacio.': {
      reply: 'Claro: Lucía salió sola a las 23:40.',
      feedback: { isUnderstandable: true, xpAwarded: 6, explanation: 'Pediste aclaración con cortesía y precisión.' },
      xpType: 'grammar',
    },
  },
  npc_inspectora_ruiz: {
    '¿Qué debo preguntar primero?': {
      reply: 'Empieza por hora, lugar y compañía. Ese orden revela grietas.',
      feedback: { isUnderstandable: true, xpAwarded: 7, explanation: 'Buen enfoque de estructura interrogativa.' },
      xpType: 'grammar',
    },
    '¿Cómo confirmo una coartada?': {
      reply: 'Con testigos, recibos y cámaras. Nunca solo con palabras.',
      feedback: { isUnderstandable: true, xpAwarded: 10, explanation: 'Pregunta clave de método detectivesco.' },
      xpType: 'investigation',
    },
    '¿Puedes corregir mi frase?': {
      reply: 'Sí: usa verbos en pasado para hechos cerrados.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 8,
        explanation: 'Solicitar corrección activa acelera tu progreso.',
      },
      xpType: 'vocabulary',
    },
  },
};
