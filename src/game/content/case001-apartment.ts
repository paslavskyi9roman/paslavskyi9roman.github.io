import type { DialogueFeedback, NpcProfile, Quest } from '@/types/game';

type ReplyOutcome = {
  reply: string;
  feedback: DialogueFeedback;
  xpType: 'investigation' | 'grammar' | 'vocabulary';
  statement?: { id: string; topic: string; value: string };
};

/**
 * Per-location overrides for the existing NPC roster.
 * The apartment hosts a tighter cast — Diego stays at his bar; Lucía and the
 * Inspectora meet the detective at her flat, where the conversation digs
 * deeper into motive, finances, and the night's missing minutes.
 */
export const APARTMENT_NPC_PROFILES: Record<string, Pick<NpcProfile, 'openingLine' | 'quickReplies'>> = {
  npc_lucia_vargas: {
    openingLine:
      'Pase, detective… aunque ya le dije todo lo que sé. Esta casa es modesta, pero es mía: cada peseta, cada cortina, cada disco de Concha Piquer. ¿Por dónde quiere empezar?',
    quickReplies: [
      '¿Conocía bien a Ramón Quintero?',
      '¿Recibió alguna visita anoche?',
      '¿Fumaba alguien aquí esta madrugada?',
      '¿De quién es ese abrigo gris?',
      '¿Por qué cobra en sobres?',
    ],
  },
  npc_inspectora_ruiz: {
    openingLine:
      'Detective, no toque nada sin guantes. Mire alrededor con calma: en un piso así, la mentira siempre deja huellas — un vaso de más, una colilla aún caliente, un nombre tachado en un cuaderno.',
    quickReplies: [
      '¿Qué buscamos primero?',
      '¿Qué dicen las colillas?',
      '¿Pedimos orden de registro?',
      '¿Cómo confirmamos el coche en la calle?',
      'Reformule mi última frase, por favor.',
    ],
  },
};

/**
 * Apartment quests — additive to the bar quests in case001.ts.
 */
export const APARTMENT_QUESTS: Quest[] = [
  {
    id: 'q4',
    locationId: 'lucia_apartment',
    title: 'Registra el apartamento',
    objective: 'Encuentra al menos 2 indicios físicos en el piso de Lucía.',
    rewardXp: 35,
  },
  {
    id: 'q5',
    locationId: 'lucia_apartment',
    title: 'Hila las contradicciones',
    objective: 'Provoca al menos una nueva contradicción interrogando a Lucía en su casa.',
    rewardXp: 45,
  },
];

export const APARTMENT_ROUTE_QUEST_REQUIRED_CLUES = 2;

/**
 * Clue → statement contradictions specific to the apartment scene.
 * These are merged into the global lookup by the store, so contradictions
 * detected in either location flow into the same accusation pipeline.
 */
export const APARTMENT_CLUE_CONTRADICTIONS: Record<string, string[]> = {
  apt_clue_photo: ['lucia_barely_knew_ramon'],
  apt_clue_ashtray: ['lucia_no_visitors'],
  apt_clue_grey_coat: ['lucia_no_visitors'],
  apt_clue_envelope: ['lucia_modest_savings'],
};

/**
 * Map of NPC id → Spanish quick-reply → outcome (NPC reply, XP, statement).
 * Apartment outcomes deliberately use longer, more revealing replies — the
 * scene is the second act of the night and the suspects are tired enough
 * to stop polishing their stories.
 */
export const APARTMENT_NPC_OUTCOMES: Record<string, Record<string, ReplyOutcome>> = {
  npc_lucia_vargas: {
    '¿Conocía bien a Ramón Quintero?': {
      reply:
        'Apenas. Coincidíamos cuando él venía a hacer crónica del barrio. Una copa, una sonrisa, nada más. No éramos amigos íntimos, detective… aunque la gente hable.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation: 'La negación blanda suele esconder más que la negación rotunda — anótala.',
      },
      xpType: 'investigation',
      statement: {
        id: 'lucia_barely_knew_ramon',
        topic: 'relationship',
        value: 'Lucía afirmó apenas conocer a Ramón Quintero',
      },
    },
    '¿Recibió alguna visita anoche?': {
      reply:
        'No, nadie. Llegué cansada del bar, me serví un vaso de agua y me acosté a las once en punto. Mis vecinos pueden confirmarlo… si los despierta sin asustarlos, claro.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 14,
        explanation: 'Una negación detallada es más fácil de desmentir con pruebas físicas. Bien preguntado.',
      },
      xpType: 'investigation',
      statement: {
        id: 'lucia_no_visitors',
        topic: 'company_home',
        value: 'Lucía afirmó que nadie la visitó en su casa esa noche',
      },
    },
    '¿Fumaba alguien aquí esta madrugada?': {
      reply:
        'Yo no fumo, detective, me destroza la voz. Esas colillas… son de la semana pasada, supongo. Tenía que haber vaciado el cenicero.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation: 'Pregunta sensorial precisa. Compárala con el estado del cenicero (ceniza fresca, papel húmedo).',
      },
      xpType: 'vocabulary',
    },
    '¿De quién es ese abrigo gris?': {
      reply:
        'Es… de mi primo Andrés, lo dejó cuando vino la semana pasada. Sí, eso es. ¿Por qué? ¿Acaso tiene importancia un abrigo viejo en mi propio recibidor?',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 13,
        explanation: 'Las muletillas («es… eso es») suelen señalar improvisación. El abrigo coincide con el del bar.',
      },
      xpType: 'investigation',
    },
    '¿Por qué cobra en sobres?': {
      reply:
        'En el bar pagan así, en mano y en sobre. No es ilegal: el dueño detesta el banco. Yo guardo lo justo para el alquiler y mando lo demás a mi madre, que vive en Toledo.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation:
          'Excelente: pregunta por el flujo de dinero. La frase establece una declaración financiera comprobable.',
      },
      xpType: 'investigation',
      statement: {
        id: 'lucia_modest_savings',
        topic: 'finances',
        value: 'Lucía dijo guardar solo lo justo para el alquiler',
      },
    },
  },
  npc_inspectora_ruiz: {
    '¿Qué buscamos primero?': {
      reply:
        'Tres cosas, en este orden: lo que está fuera de sitio, lo que está demasiado en su sitio, y lo que falta. Un piso ordenado en exceso suele ser un piso recién barrido.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 9,
        explanation: 'Buena pregunta procedimental. Te da una pauta para escanear la habitación.',
      },
      xpType: 'investigation',
    },
    '¿Qué dicen las colillas?': {
      reply:
        'Mucho. Si la ceniza aún tiene curva y el papel huele a tabaco fresco, fueron apagadas hace pocas horas. Y si el carmín del filtro no coincide con el de Lucía, tenemos un visitante.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 14,
        explanation: 'Magnífico: vocabulario forense aplicado. Practica «ceniza», «filtro», «carmín».',
      },
      xpType: 'vocabulary',
    },
    '¿Pedimos orden de registro?': {
      reply:
        'Ya está firmada, detective: el juez Bermúdez me la dio antes del amanecer. Por eso podemos abrir cajones, pero no podemos forzar cerraduras. Si encuentra una caja con llave, llámeme.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 11,
        explanation: 'Aprende este giro burocrático: «orden de registro» es el sésamo de la jefatura.',
      },
      xpType: 'vocabulary',
    },
    '¿Cómo confirmamos el coche en la calle?': {
      reply:
        'Hablamos con la portera y con el sereno. Ellos llevan en la oreja toda la calle. Y si hubo coche, alguien recordará la matrícula, aunque sea un par de letras.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation: 'Pregunta operativa: combina testigos humanos con detalle físico (matrícula).',
      },
      xpType: 'grammar',
    },
    'Reformule mi última frase, por favor.': {
      reply:
        'Con gusto. Cuando dude, prefiera el pretérito perfecto compuesto para hechos cercanos: «He encontrado una colilla» suena más profesional que «encontré una colilla» en un parte oficial.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 9,
        suggestedCorrection: 'He encontrado una colilla.',
        explanation: 'Solicitar reformulaciones consolida el registro formal del informe policial.',
      },
      xpType: 'grammar',
    },
  },
};
