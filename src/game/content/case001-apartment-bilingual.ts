/**
 * Bilingual extension for the apartment scene. Mirrors the structure of
 * case001-bilingual.ts so the InterrogationPanel can resolve English
 * translations regardless of which location is active.
 */

import type { BilingualNpc, BilingualReply, SceneClue } from '@/game/content/case001-bilingual';

/**
 * Apartment-specific NPC overrides — used to swap the opening line and
 * tagline when an NPC is interviewed at the flat instead of at the bar.
 */
export const APARTMENT_BILINGUAL_NPCS: Record<string, Pick<BilingualNpc, 'openingEn' | 'tagline' | 'taglineEn'>> = {
  npc_lucia_vargas: {
    openingEn:
      "Come in, detective… though I've already told you everything I know. This place is modest, but it's mine: every peseta, every curtain, every Concha Piquer record. Where would you like to start?",
    tagline: 'Cantante de la taberna. Recibe en su propio piso.',
    taglineEn: 'Tavern singer. Receives you in her own flat.',
  },
  npc_inspectora_ruiz: {
    openingEn:
      "Detective, don't touch a thing without gloves. Look around calmly: in a flat like this, the lie always leaves traces — an extra glass, a still-warm cigarette butt, a name crossed out in a notebook.",
    tagline: 'Veterana. Acude al registro con orden judicial.',
    taglineEn: 'Veteran. Arrives with a signed search warrant.',
  },
};

/** Bilingual quick replies for apartment dialogues. */
export const APARTMENT_BILINGUAL_REPLIES: Record<string, Record<string, BilingualReply>> = {
  npc_lucia_vargas: {
    '¿Conocía bien a Ramón Quintero?': {
      q: '¿Conocía bien a Ramón Quintero?',
      qEn: 'Did you know Ramón Quintero well?',
      aEn: "Barely. We'd cross paths when he came to write a piece about the neighborhood. A drink, a smile, nothing more. We weren't close friends, detective… whatever people may say.",
      statementValueEn: 'Lucía claims she barely knew Ramón Quintero',
    },
    '¿Recibió alguna visita anoche?': {
      q: '¿Recibió alguna visita anoche?',
      qEn: 'Did you receive any visitor last night?',
      aEn: 'No, nobody. I came home tired from the tavern, poured myself a glass of water and went to bed at eleven sharp. My neighbors can confirm it… if you wake them gently, of course.',
      statementValueEn: 'Lucía claims nobody visited her at home that night',
    },
    '¿Fumaba alguien aquí esta madrugada?': {
      q: '¿Fumaba alguien aquí esta madrugada?',
      qEn: 'Was anyone smoking here in the small hours?',
      aEn: "I don't smoke, detective — it ruins my voice. Those butts… must be from last week, I suppose. I should have emptied the ashtray.",
    },
    '¿De quién es ese abrigo gris?': {
      q: '¿De quién es ese abrigo gris?',
      qEn: 'Whose is that grey coat?',
      aEn: "It's… my cousin Andrés's. He left it here when he visited last week. Yes, that's it. Why? Does an old coat in my own hallway really matter?",
    },
    '¿Por qué cobra en sobres?': {
      q: '¿Por qué cobra en sobres?',
      qEn: 'Why are you paid in envelopes?',
      aEn: "That's how the tavern pays — by hand, in an envelope. It isn't illegal: the owner detests banks. I keep just enough for rent and send the rest to my mother in Toledo.",
      statementValueEn: 'Lucía said she only kept enough cash for rent',
    },
  },
  npc_inspectora_ruiz: {
    '¿Qué buscamos primero?': {
      q: '¿Qué buscamos primero?',
      qEn: 'What do we look for first?',
      aEn: 'Three things, in this order: what is out of place, what is too much in place, and what is missing. An overly tidy flat is usually a freshly swept one.',
    },
    '¿Qué dicen las colillas?': {
      q: '¿Qué dicen las colillas?',
      qEn: 'What do the cigarette butts tell us?',
      aEn: "Plenty. If the ash still curves and the paper smells of fresh tobacco, they were stubbed out hours ago. And if the lipstick on the filter doesn't match Lucía's, we have a visitor.",
    },
    '¿Pedimos orden de registro?': {
      q: '¿Pedimos orden de registro?',
      qEn: 'Should we request a search warrant?',
      aEn: 'Already signed, detective: Judge Bermúdez handed it to me before dawn. That lets us open drawers, but not force locks. If you find a locked box, call me.',
    },
    '¿Cómo confirmamos el coche en la calle?': {
      q: '¿Cómo confirmamos el coche en la calle?',
      qEn: 'How do we confirm the car on the street?',
      aEn: 'We talk to the doorwoman and the night watchman. They keep an ear on the whole block. If there was a car, somebody will remember the plate — even if only a couple of letters.',
    },
    'Reformule mi última frase, por favor.': {
      q: 'Reformule mi última frase, por favor.',
      qEn: 'Reformulate my last sentence, please.',
      aEn: 'Gladly. When in doubt, prefer the present perfect for recent facts: "He encontrado una colilla" sounds more professional than "encontré una colilla" in an official report.',
      correction: {
        from: 'encontré una colilla',
        to: 'he encontrado una colilla',
        note: 'En partes oficiales, el pretérito perfecto compuesto suena más formal.',
      },
    },
  },
};

/**
 * Clickable clue dots laid out over /assets/scenes/bg_lucia_apartment.png.
 * Coordinates are tuned to the existing artwork (percent of width/height).
 */
export const APARTMENT_SCENE_CLUES: SceneClue[] = [
  {
    id: 'apt_clue_photo',
    title: 'Foto rota en la papelera',
    titleEn: 'Torn photo in the wastebasket',
    description: 'Lucía y Ramón en la Verbena de San Cayetano, 1952. Sonrisas idénticas, mano sobre hombro.',
    descriptionEn: 'Lucía and Ramón at the San Cayetano fair, 1952. Identical smiles, hand on shoulder.',
    examinePrompt:
      'Una fotografía rota dentro de la papelera. Si juntas los pedazos, dos sonrisas y una mano sobre un hombro.',
    examinePromptEn:
      'A torn photograph inside the wastebasket. Pieced back together, two smiles and a hand on a shoulder.',
    x: 18,
    y: 72,
  },
  {
    id: 'apt_clue_ashtray',
    title: 'Cenicero con colillas',
    titleEn: 'Ashtray with cigarette butts',
    description: 'Tres Ducados a medio fumar. Carmín rojo en dos filtros — distinto al pintalabios de Lucía.',
    descriptionEn: "Three half-smoked Ducados. Red lipstick on two filters — different shade from Lucía's.",
    examinePrompt: 'El cenicero rebosa de Ducados a medio fumar. Hay carmín en dos filtros — pero no es el suyo.',
    examinePromptEn:
      'The ashtray is heavy with half-smoked Ducados. Two filters carry red carmine — but not her shade.',
    x: 50,
    y: 58,
  },
  {
    id: 'apt_clue_grey_coat',
    title: 'Abrigo gris en el perchero',
    titleEn: 'Grey coat on the rack',
    description: 'Lana inglesa, talla de hombre. Bolsillo: cerillas «Hotel Atocha» — idénticas a las del callejón.',
    descriptionEn:
      'English wool, men\'s size. Pocket: matchbook from "Hotel Atocha" — identical to those in the alley.',
    examinePrompt:
      'Un abrigo gris cuelga del perchero. Lana inglesa, talla de hombre. En el bolsillo, cerillas del Hotel Atocha.',
    examinePromptEn:
      "A grey coat hangs on the rack. English wool, man's size. In the pocket, matches from the Hotel Atocha.",
    x: 82,
    y: 38,
  },
  {
    id: 'apt_clue_envelope',
    title: 'Sobre con pesetas',
    titleEn: 'Envelope of pesetas',
    description: 'Cinco mil pesetas en billetes nuevos, atados con goma. Sobre rotulado: «R.Q. — silencio».',
    descriptionEn: 'Five thousand pesetas in fresh notes, banded together. Envelope labelled: "R.Q. — silence".',
    examinePrompt:
      'Un sobre asoma bajo unos papeles. Pesetas nuevas, atadas con goma. Una palabra al frente: silencio.',
    examinePromptEn:
      'An envelope peeks out from under some papers. Fresh pesetas, banded with rubber. One word on the front: silence.',
    requires: { statementIds: ['lucia_no_visitors'] },
    x: 38,
    y: 30,
  },
];
