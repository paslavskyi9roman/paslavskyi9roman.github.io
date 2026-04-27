import type { DialogueFeedback, NpcProfile, Quest } from '@/types/game';

type ReplyOutcome = {
  reply: string;
  feedback: DialogueFeedback;
  xpType: 'investigation' | 'grammar' | 'vocabulary';
  statement?: { id: string; topic: string; value: string };
};

/**
 * Third location of case 001 — the Argumosa newsstand at the mouth of the
 * Lavapiés metro, where the anonymous caller (Ramón's younger sister, Mercedes
 * Quintero) was traced via the cabina telefónica beside her stand. The scene
 * closes the apartment-ashtray "second woman" thread and gives the detective
 * a witness whose testimony breaks Lucía's "no visitors" and "barely knew him"
 * defences in one stretch.
 */

export const MERCEDES_NPC_PROFILE: NpcProfile = {
  id: 'npc_mercedes_quintero',
  name: 'Mercedes Quintero',
  role: 'Hermana de Ramón · vendedora de prensa',
  openingLine:
    'Detective… le esperaba. Sabía que tarde o temprano iban a dar con el teléfono. Yo solo… solo quise hacer lo que mi hermano habría hecho. Llamar. Decir lo que vi. Aunque me temblaran las manitas.',
  lessonFocus: 'investigation',
  quickReplies: [
    '¿Por qué estuvo en casa de Lucía anoche?',
    '¿Qué vio al salir del piso?',
    '¿Qué investigaba su hermano?',
    '¿Reconoce este pintalabios?',
    '¿Llamó usted a la policía?',
  ],
};

/**
 * Per-location overrides for the existing NPC roster at Argumosa.
 * Mercedes uses her base profile (she only appears here); the Inspectora
 * receives a fresh opening line and quick replies that fit a witness
 * interview rather than a search.
 */
export const ARGUMOSA_NPC_PROFILES: Record<string, Pick<NpcProfile, 'openingLine' | 'quickReplies'>> = {
  npc_inspectora_ruiz: {
    openingLine:
      'Detective, la chica está hecha trizas pero piensa con claridad. La cabina lleva un contador mecánico — por eso pudimos rastrear la llamada al minuto. Trátela con calma; cualquier presión y se cierra como una almeja.',
    quickReplies: [
      '¿Cómo dimos con ella?',
      '¿Qué hacemos con el carmín?',
      '¿Es su testimonio admisible?',
      'Resumen del caso, por favor.',
    ],
  },
};

/**
 * Argumosa quests — additive to the bar and apartment quests.
 *   q6: locate the witness (find ≥2 clues at the kiosko)
 *   q7: take her statement (record ≥1 statement from Mercedes)
 *   q8: close the circle (provoke ≥1 new contradiction against Lucía here)
 */
export const ARGUMOSA_QUESTS: Quest[] = [
  {
    id: 'q6',
    title: 'Localiza a la testigo',
    objective: 'Encuentra al menos 2 indicios en el kiosko de Argumosa.',
    rewardXp: 35,
  },
  {
    id: 'q7',
    title: 'Toma su declaración',
    objective: 'Registra al menos una declaración de Mercedes Quintero.',
    rewardXp: 35,
  },
  {
    id: 'q8',
    title: 'Cierra el círculo',
    objective: 'Provoca al menos una nueva contradicción contra Lucía aquí.',
    rewardXp: 50,
  },
];

export const ARGUMOSA_ROUTE_QUEST_REQUIRED_CLUES = 2;

/**
 * Argumosa clues all attack Lucía's previously-recorded apartment lies.
 * The phone-box slip is ambient — it confirms the timeline without
 * contradicting any statement directly.
 */
export const ARGUMOSA_CLUE_CONTRADICTIONS: Record<string, string[]> = {
  arg_clue_lipstick: ['lucia_no_visitors'],
  arg_clue_receipt: ['lucia_no_visitors'],
  arg_clue_diarios: ['lucia_barely_knew_ramon'],
};

/**
 * Quick replies that only become available after a specific clue has been
 * discovered. Mercedes only volunteers to identify her lipstick once the
 * detective has pulled the «Coral Sevilla» tube off the kiosk shelf.
 */
export const ARGUMOSA_QUICK_REPLY_CLUE_GATES: Record<string, Record<string, string>> = {
  npc_mercedes_quintero: {
    '¿Reconoce este pintalabios?': 'arg_clue_lipstick',
  },
};

export const ARGUMOSA_NPC_OUTCOMES: Record<string, Record<string, ReplyOutcome>> = {
  npc_mercedes_quintero: {
    '¿Por qué estuvo en casa de Lucía anoche?': {
      reply:
        'Porque mi hermano me llamó tres veces el lunes y la última solo era silencio. Compré dos paquetes de Ducados de camino — los suyos, los que él fumaba — y subí a su casa fingiendo ser una amiga del barrio. Nos sentamos a fumar. Ella mintió como una santa, detective.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 14,
        explanation:
          'Pregunta directa que sitúa a la testigo en el piso. Anota la marca: Ducados — coincide con el cenicero.',
      },
      xpType: 'investigation',
      statement: {
        id: 'mercedes_visited_lucia',
        topic: 'apartment_visit',
        value: 'Mercedes confirmó haber visitado a Lucía la noche del 14',
      },
    },
    '¿Qué vio al salir del piso?': {
      reply:
        'Bajé temblando. Iba al metro, pero pasé por la callejuela de La Sirena porque oí voces. Vi a Lucía debajo de la farola rota, con las manos manchadas. Ramón ya no se levantaba. Eché a correr hasta la cabina de mi puesto.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 16,
        explanation: 'Testimonio ocular directo. Contrástalo con la coartada de Lucía a las 22:30.',
      },
      xpType: 'investigation',
      statement: {
        id: 'mercedes_saw_lucia_alley',
        topic: 'eyewitness',
        value: 'Mercedes vio a Lucía en la callejuela junto a Ramón',
      },
    },
    '¿Qué investigaba su hermano?': {
      reply:
        'A ella, detective. La estaba pagando para que callara — pero no sé el qué. Algo de un señor del Atocha, un abrigo gris, una foto antigua. Yo lo sé porque al sacudirle la chaqueta cuando venía a recoger el Diario, los papelillos caían de los bolsillos.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 14,
        explanation:
          'La testigo confirma el sobre del «silencio». Vincula Hotel Atocha, abrigo gris y foto en una sola línea.',
      },
      xpType: 'investigation',
      statement: {
        id: 'mercedes_ramon_investigating',
        topic: 'motive',
        value: 'Mercedes confirmó que Ramón pagaba a Lucía por silencio',
      },
    },
    '¿Reconoce este pintalabios?': {
      reply:
        'Sí. «Coral Sevilla», de Maja. Si busca el carmín que no era el suyo en el cenicero de Lucía, búsquelo en mis labios, detective. Ya no tengo nada que ocultar — al menos eso.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation:
          'La testigo se identifica como la segunda mujer del cenicero. Vocabulario: «carmín», «filtro», «cenicero».',
      },
      xpType: 'vocabulary',
    },
    '¿Llamó usted a la policía?': {
      reply:
        'A las cero cero siete, desde la cabina de aquí mismo. Marqué con los guantes de mi madre. Le dije al sargento de guardia: «En la callejuela de La Sirena. Hay un hombre. Dense prisa.» Y colgué antes de que me preguntara el nombre.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation:
          'Confesión limpia de la llamada anónima. El indefinido («marqué», «dije», «colgué») cierra los hechos.',
      },
      xpType: 'grammar',
      statement: {
        id: 'mercedes_anonymous_call',
        topic: 'phone_call',
        value: 'Mercedes admitió haber llamado a la jefatura a las 00:07 desde Calle Argumosa',
      },
    },
  },
  npc_inspectora_ruiz: {
    '¿Cómo dimos con ella?': {
      reply:
        'La cabina del 14 de octubre marcó una sola llamada saliente entre las cero y la una: a la jefatura, exactamente a las cero cero siete. La centralita anota cabina y minuto. Bastó con mirar quién duerme cerca y quién no había vuelto a casa esa noche.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation:
          'Procedimiento clásico: cabina + centralita + barrio. Memoriza «contador mecánico» y «centralita».',
      },
      xpType: 'investigation',
    },
    '¿Qué hacemos con el carmín?': {
      reply:
        'Comparamos el tono del filtro de Lucía con el del pintalabios de la chica. Si el laboratorio confirma «Coral Sevilla» en ambos, su declaración deja de ser conjetura: es una huella química con nombre y apellido.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 11,
        explanation: 'Vocabulario forense aplicado al carmín. Practica «tono», «filtro», «laboratorio».',
      },
      xpType: 'vocabulary',
    },
    '¿Es su testimonio admisible?': {
      reply:
        'Si lo firma de su puño y letra y un abogado de oficio acompaña la declaración, sí. La llamada anónima por sí sola no condena, pero corrobora cronología. Lo grueso lo aporta lo que vio en la callejuela.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 9,
        explanation: 'Un giro útil: «de su puño y letra» = handwritten. La burocracia se aprende repitiéndola.',
      },
      xpType: 'grammar',
    },
    'Resumen del caso, por favor.': {
      reply:
        'Tres escenas, una mentira que se desmadeja: la taberna situó a Lucía a las 23:48, su piso reveló al hombre del Atocha y el sobre del silencio, y Argumosa nos da una testigo que la vio salir del callejón. Le toca a usted decidir cuándo cerrar el círculo.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 8,
        explanation: 'Reconstrucción narrativa del caso. Apóyate en este resumen antes de la acusación.',
      },
      xpType: 'investigation',
    },
  },
};
