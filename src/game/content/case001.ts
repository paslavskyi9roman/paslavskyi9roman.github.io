import { type DialogueFeedback, type Lesson, type NpcProfile, type Quest } from '@/types/game';
import { MERCEDES_NPC_PROFILE } from '@/game/content/case001-argumosa';

type ReplyOutcome = {
  reply: string;
  feedback: DialogueFeedback;
  xpType: 'investigation' | 'grammar' | 'vocabulary';
  statement?: { id: string; topic: string; value: string };
};

export const CASE_001_CULPRIT = 'npc_lucia_vargas';

export const CASE_001_CLUE_CONTRADICTIONS: Record<string, string[]> = {
  clue_note: ['lucia_home_2230'],
  clue_receipt: ['lucia_alone_home'],
};

/**
 * Bar-scene quick replies that are only offered after a specific clue has been
 * discovered. Lucía's «Explíquelo» reply is the second-tier confrontation that
 * unlocks once the player has the 23:48 receipt in hand.
 */
export const CASE_001_QUICK_REPLY_CLUE_GATES: Record<string, Record<string, string>> = {
  npc_lucia_vargas: {
    'Su recibo dice 23:48. Explíquelo.': 'clue_receipt',
  },
};

export const CASE_001_NPCS: NpcProfile[] = [
  {
    id: 'npc_lucia_vargas',
    name: 'Lucía Vargas',
    role: 'Sospechosa principal',
    openingLine:
      'No vi nada esa noche, detective. Estaba en casa, sola, oyendo la radio. Si quiere preguntar, hágalo rápido — me espera el último pase y don Mauricio descuenta cada minuto del jornal.',
    lessonFocus: 'investigation',
    quickReplies: [
      '¿Estabas sola?',
      '¿A qué hora llegaste a casa?',
      '¿Qué cantaste esa noche?',
      '¿Conocías al periodista?',
      'No entiendo.',
      // Gated on clue_receipt — see CASE_001_QUICK_REPLY_CLUE_GATES below.
      'Su recibo dice 23:48. Explíquelo.',
    ],
  },
  {
    id: 'npc_diego_torres',
    name: 'Diego Torres',
    role: 'Camarero del bar',
    openingLine:
      'Cerramos a medianoche, pero algunos clientes se quedaron fuera, fumando bajo la marquesina. Yo estaba secando vasos con una mano y echando a borrachos con la otra. Con eso le digo todo y nada, detective.',
    lessonFocus: 'vocabulary',
    quickReplies: [
      '¿Viste a Lucía?',
      '¿Quién pagó la última ronda?',
      '¿Hubo discusiones esa noche?',
      'Describe al hombre del abrigo gris.',
      'Repítelo más despacio.',
    ],
  },
  {
    id: 'npc_inspectora_ruiz',
    name: 'Inspectora Ruiz',
    role: 'Mentora policial',
    openingLine:
      'Tienes que conectar testigos, tiempo y pruebas físicas. Cada coartada se rompe por el eslabón más débil; tu trabajo no es destrozarla a martillazos, sino encontrar la grieta y soplar despacio hasta que se abra.',
    lessonFocus: 'grammar',
    quickReplies: [
      '¿Qué debo preguntar primero?',
      '¿Cómo confirmo una coartada?',
      '¿Tomamos huellas en el callejón?',
      '¿Quién avisó a la policía?',
      '¿Puedes corregir mi frase?',
    ],
  },
  MERCEDES_NPC_PROFILE,
];

export const CASE_001_QUESTS: Quest[] = [
  {
    id: 'q1',
    locationId: 'bar_interior',
    title: 'Verifica la coartada',
    objective: 'Habla con Lucía y detecta una contradicción horaria.',
    rewardXp: 30,
  },
  {
    id: 'q2',
    locationId: 'bar_interior',
    title: 'Reconstruye la ruta',
    objective: 'Encuentra 2 pistas físicas en la escena.',
    rewardXp: 35,
  },
  {
    id: 'q3',
    locationId: 'bar_interior',
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
  {
    id: 'l4',
    title: 'Indefinido para hechos cerrados',
    tip: '«Vi», «hablé», «encontré» suenan a parte oficial. El imperfecto suena a duda.',
    xpType: 'grammar',
  },
  {
    id: 'l5',
    title: 'Vocabulario forense',
    tip: 'Aprende: ceniza, filtro, carmín, huella, cabina, centralita.',
    xpType: 'vocabulary',
  },
  {
    id: 'l6',
    title: 'Cronología antes que motivo',
    tip: 'Hora, lugar, compañía — en ese orden. Las grietas aparecen solas.',
    xpType: 'investigation',
  },
];

export const NPC_OUTCOMES: Record<string, Record<string, ReplyOutcome>> = {
  npc_lucia_vargas: {
    '¿Estabas sola?': {
      reply:
        'Sí… completamente sola. Mi compañera de piso, Pilar, está en Salamanca cuidando a su madre desde el lunes. No espero visitas y no las recibo: la portera puede confirmarlo, sube de mala gana hasta para subir la leche.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 8,
        explanation:
          'Buena pregunta para verificar coartadas — además, ahora tienes nombre (Pilar) y testigo (la portera).',
      },
      xpType: 'investigation',
      statement: {
        id: 'lucia_alone_home',
        topic: 'company',
        value: 'Lucía afirmó estar sola en casa',
      },
    },
    '¿A qué hora llegaste a casa?': {
      reply:
        'Sobre las diez y media… creo. Crucé la Plaza de Lavapiés, compré tabaco al sereno y subí los tres pisos sin encender la luz. Después, nada: la radio nacional, una taza de tila, y a la cama antes de las once en punto.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation:
          'Excelente enfoque temporal: ahora tienes una secuencia (plaza, sereno, escalera) que se puede verificar.',
      },
      xpType: 'investigation',
      statement: {
        id: 'lucia_home_2230',
        topic: 'arrival_time',
        value: 'Lucía dijo llegar a las 22:30',
      },
    },
    '¿Qué cantaste esa noche?': {
      reply:
        '«Ojos verdes» y «La hija de don Juan Alba». La sala estaba llena, hasta las paredes sudaban. Cuando una canta, detective, no piensa en nadie más; ni en lo que pasa fuera, ni en lo que se debe en la barra.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 9,
        explanation: 'Pregunta cultural que abre vocabulario de la copla: «pase», «sala», «sudar las paredes».',
      },
      xpType: 'vocabulary',
    },
    '¿Conocías al periodista?': {
      reply:
        'Coincidíamos. Ramón venía algunas noches a tomar nota — preguntaba por las canciones, por los habituales del barrio. Yo le servía vermú; él me servía silencio cuando se ponía pesado. Nada más, detective. Nada más.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation: 'La triple negación («nada más, detective. Nada más») suele señalar incomodidad. Anótala.',
      },
      xpType: 'investigation',
    },
    'No entiendo.': {
      reply: 'Pues más claro, agua: no salí de casa. Nada más, detective. ¿Sigo?',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 4,
        suggestedCorrection: 'No lo entiendo.',
        explanation: 'Añadir «lo» suena más natural cuando se pide aclaración en español peninsular.',
      },
      xpType: 'grammar',
    },
    'Su recibo dice 23:48. Explíquelo.': {
      reply:
        'Bueno… volví un momento, sí. Por el bolso, que se me había olvidado. No lo dije porque no me pareció importante. Cinco minutos, detective. Cinco. Después a casa.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 13,
        explanation:
          'La coartada se rompe sola: la suspecta cambia su declaración para acomodar la prueba física. Anota el tono dubitativo.',
      },
      xpType: 'investigation',
      statement: {
        id: 'lucia_brief_return',
        topic: 'arrival_time',
        value: 'Lucía rectificó: dice haber vuelto al bar brevemente a las 23:48',
      },
    },
  },
  npc_diego_torres: {
    '¿Viste a Lucía?': {
      reply:
        'Sí, la vi salir rápido. Miró el reloj de pared dos o tres veces antes de irse, como quien tiene una cita y la teme. Cogió el abrigo del perchero, no se despidió de nadie y pasó por la puerta del callejón en lugar de la calle.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 9,
        explanation: 'Pregunta directa que produce detalle útil — el callejón coloca a Lucía cerca del cuerpo.',
      },
      xpType: 'investigation',
    },
    '¿Quién pagó la última ronda?': {
      reply:
        'Un hombre con abrigo gris, traje cortado por sastre — no es de los nuestros. Pagó dos vermús y un café cargado, dejó propina en monedas grandes y salió por la puerta del callejón. Olía a colonia de hotel, no a barbería de barrio.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 11,
        explanation:
          'Excelente: la transacción aporta clase social, ruta de salida y un olor que sitúa al hombre en un hotel.',
      },
      xpType: 'vocabulary',
    },
    '¿Hubo discusiones esa noche?': {
      reply:
        'Una, en la mesa del fondo: Ramón Quintero y un señor que no había visto antes. Voces bajas, dedos en alto. Cuando me acerqué con el sifón, callaron los dos a la vez. Esa clase de silencio no se sirve, detective; se compra.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation:
          'Pregunta abierta que pesca un episodio — y un giro idiomático («el silencio se compra») digno del cuaderno.',
      },
      xpType: 'investigation',
    },
    'Describe al hombre del abrigo gris.': {
      reply:
        'Alto, pelo cano, manos cuidadas — manos que no parten leña. Anillo de sello en el meñique. Olor a colonia de hotel, no a barbería de barrio. El traje no era de aquí. Y dejó algo encima de la barra antes de irse, pero hasta que usted no lo encuentre, prefiero no señalarlo.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 11,
        explanation:
          'Descripción rica en sustantivos: practica «cano», «sello», «meñique». Lo que dejó en la barra es para que lo descubra usted.',
      },
      xpType: 'vocabulary',
    },
    'Repítelo más despacio.': {
      reply:
        'Claro, sin prisa: Lu-cí-a sa-lió so-la a las on-ce y cua-ren-ta. Le miré el reloj a la pared para asegurarme. Lo apunto en mi cabeza por si acaso, detective; en este oficio, los minutos pesan más que los billetes.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 6,
        explanation:
          'Pediste aclaración con cortesía y precisión — escucha cómo separa las sílabas para fijar la hora.',
      },
      xpType: 'grammar',
    },
  },
  npc_inspectora_ruiz: {
    '¿Qué debo preguntar primero?': {
      reply:
        'Empieza por la hora, sigue por el lugar y termina por la compañía. Ese orden revela grietas: nadie inventa los tres datos a la vez sin contradecirse en al menos uno. Apúntalo en el cuaderno: cronología antes que motivo.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 7,
        explanation: 'Buen enfoque de estructura interrogativa. Memoriza la regla de oro: cronología antes que motivo.',
      },
      xpType: 'grammar',
    },
    '¿Cómo confirmo una coartada?': {
      reply:
        'Con testigos cruzados, recibos sellados y serenos despiertos. Nunca solo con palabras: una declaración sin papel detrás se evapora antes del juicio. Y si alguien se ofrece como testigo demasiado pronto, sospecha doble.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 10,
        explanation:
          'Pregunta clave de método detectivesco — quédate con la última frase: «testigo demasiado pronto, sospecha doble».',
      },
      xpType: 'investigation',
    },
    '¿Tomamos huellas en el callejón?': {
      reply:
        'Sí. Tres juegos parciales, levantados al amanecer. Dos son de habituales. El tercero, mano grande, anillo en el meñique. Ese.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 12,
        explanation: 'Excelente: pregunta forense. Cruza el anillo del meñique con la descripción del camarero.',
      },
      xpType: 'investigation',
    },
    '¿Quién avisó a la policía?': {
      reply:
        'Una mujer anónima desde el teléfono público de la calle Argumosa. Voz joven, acento del sur. Colgó antes de dar nombre. La centralita lo registró a las cero horas y siete minutos. Si encuentras a esa mujer, encuentras a quien vio.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 11,
        explanation: 'Pregunta de procedencia: la llamada anónima abre una línea nueva (teléfono, hora, voz, acento).',
      },
      xpType: 'vocabulary',
    },
    '¿Puedes corregir mi frase?': {
      reply:
        'Claro: usa el pretérito indefinido para hechos cerrados — «vi», «hablé», «encontré». El imperfecto («veía», «hablaba») suena a duda, y la duda no condena. Habla como quien firma un parte oficial.',
      feedback: {
        isUnderstandable: true,
        xpAwarded: 8,
        explanation: 'Solicitar corrección activa acelera tu progreso. Recuerda: indefinido para hechos cerrados.',
      },
      xpType: 'vocabulary',
    },
  },
};
