/**
 * Bilingual extension for the Argumosa kiosk scene. Mirrors the structure of
 * case001-apartment-bilingual.ts so the InterrogationPanel can resolve English
 * translations regardless of the active location.
 */

import type { BilingualNpc, BilingualReply, SceneClue } from '@/game/content/case001-bilingual';

/**
 * Argumosa-specific NPC overrides. Mercedes uses her base bilingual entry
 * (she only appears here); the Inspectora gets a fresh opening and tagline
 * suited to a witness interview at the metro entrance.
 */
export const ARGUMOSA_BILINGUAL_NPCS: Record<string, Pick<BilingualNpc, 'openingEn' | 'tagline' | 'taglineEn'>> = {
  npc_inspectora_ruiz: {
    openingEn:
      "Detective, the girl is in pieces but thinks clearly. The phone box has a mechanical counter — that's how we traced the call to the minute. Handle her gently; press too hard and she shuts like a clam.",
    tagline: 'Veterana. Ha rastreado la llamada anónima.',
    taglineEn: 'Veteran. Has traced the anonymous call.',
  },
};

export const ARGUMOSA_BILINGUAL_REPLIES: Record<string, Record<string, BilingualReply>> = {
  npc_mercedes_quintero: {
    '¿Por qué estuvo en casa de Lucía anoche?': {
      q: '¿Por qué estuvo en casa de Lucía anoche?',
      qEn: "Why were you at Lucía's flat last night?",
      aEn: 'Because my brother phoned me three times on Monday and the last call was only silence. I bought two packets of Ducados on the way — his brand, the ones he smoked — and went up to her flat pretending to be a friend from the neighborhood. We sat down to smoke. She lied like a saint, detective.',
      statementValueEn: "Mercedes confirmed visiting Lucía's flat on the night of 14 October",
    },
    '¿Qué vio al salir del piso?': {
      q: '¿Qué vio al salir del piso?',
      qEn: 'What did you see when you left the flat?',
      aEn: 'I went down the stairs trembling. I was heading for the metro, but I cut through the alley behind La Sirena because I heard voices. I saw Lucía under the broken streetlamp, with stained hands. Ramón was no longer getting up. I ran to the phone box beside my stand.',
      statementValueEn: 'Mercedes saw Lucía in the alley beside Ramón',
    },
    '¿Qué investigaba su hermano?': {
      q: '¿Qué investigaba su hermano?',
      qEn: 'What was your brother investigating?',
      aEn: "Her, detective. He was paying her to keep quiet — though I don't know exactly what about. Something about a gentleman from the Atocha, a grey coat, an old photograph. I know because when I'd brush off his jacket as he came to pick up the Diario, little scraps of paper would fall out of the pockets.",
      statementValueEn: 'Mercedes confirmed Ramón was paying Lucía for her silence',
    },
    '¿Reconoce este pintalabios?': {
      q: '¿Reconoce este pintalabios?',
      qEn: 'Do you recognise this lipstick?',
      aEn: "Yes. \"Coral Sevilla,\" by Maja. If you're looking for the lipstick that wasn't hers in Lucía's ashtray, look on my own lips, detective. I have nothing left to hide — at least not that.",
    },
    '¿Llamó usted a la policía?': {
      q: '¿Llamó usted a la policía?',
      qEn: 'Did you call the police?',
      aEn: 'At seven minutes past midnight, from the box right here. I dialled with my mother\'s gloves on. I told the duty sergeant: "In the alley behind La Sirena. There\'s a man. Hurry." Then I hung up before he could ask my name.',
      statementValueEn: 'Mercedes admitted she made the anonymous call from Calle Argumosa at 00:07',
    },
  },
  npc_inspectora_ruiz: {
    '¿Cómo dimos con ella?': {
      q: '¿Cómo dimos con ella?',
      qEn: 'How did we find her?',
      aEn: "The phone box logged a single outgoing call between midnight and one on October 14: to HQ, at exactly seven past. The switchboard records the booth and the minute. After that we just had to ask who sleeps nearby — and who hadn't gone home that night.",
    },
    '¿Qué hacemos con el carmín?': {
      q: '¿Qué hacemos con el carmín?',
      qEn: 'What do we do about the lipstick?',
      aEn: 'We compare the shade on Lucía\'s filter with the girl\'s lipstick tube. If the lab confirms "Coral Sevilla" on both, her testimony stops being conjecture: it becomes a chemical fingerprint with a first and last name.',
    },
    '¿Es su testimonio admisible?': {
      q: '¿Es su testimonio admisible?',
      qEn: 'Is her testimony admissible?',
      aEn: 'If she signs it in her own handwriting and a duty solicitor witnesses the statement, yes. The anonymous call alone does not convict, but it corroborates the timeline. The weight comes from what she saw in the alley.',
    },
    'Resumen del caso, por favor.': {
      q: 'Resumen del caso, por favor.',
      qEn: 'A summary of the case, please.',
      aEn: 'Three scenes, a single lie unravelling: the tavern placed Lucía there at 23:48, her flat revealed the man from the Atocha and the silence envelope, and Argumosa gives us a witness who saw her leaving the alley. The choice of when to close the circle is yours, detective.',
    },
  },
};

/** Clickable clue dots laid out over /assets/scenes/bg_metro_station.png. */
export const ARGUMOSA_SCENE_CLUES: SceneClue[] = [
  {
    id: 'arg_clue_lipstick',
    title: 'Pintalabios «Coral Sevilla»',
    titleEn: '"Coral Sevilla" lipstick',
    description: 'Tubo abierto sobre el mostrador del kiosko. Carmín coral, marca Maja.',
    descriptionEn: 'Open tube on the kiosk counter. Coral red, by Maja.',
    x: 28,
    y: 64,
  },
  {
    id: 'arg_clue_receipt',
    title: 'Recibo del estanco',
    titleEn: 'Tobacconist receipt',
    description: 'Estanco Lavapiés · 14·X · 22:15 · 2 paquetes de Ducados.',
    descriptionEn: 'Estanco Lavapiés · 14·X · 22:15 · 2 packets of Ducados.',
    x: 70,
    y: 42,
  },
  {
    id: 'arg_clue_diarios',
    title: 'Pila de Diarios anotados',
    titleEn: 'Stack of annotated Diarios',
    description: 'Ejemplares con la firma de Ramón rodeada en rojo. Nota: «¿qué silencio? — M.»',
    descriptionEn: 'Issues with Ramón\'s byline circled in red. Margin note: "what silence? — M."',
    x: 16,
    y: 30,
  },
  {
    id: 'arg_clue_phonebox',
    title: 'Albarán de cabina',
    titleEn: 'Cabina call slip',
    description: 'Carbón duplicado del contador mecánico: «00:07 · 14·X · sin nombre».',
    descriptionEn: 'Carbon duplicate from the mechanical counter: "00:07 · 14·X · no name."',
    x: 84,
    y: 76,
  },
];
