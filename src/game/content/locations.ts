import type { BilingualText } from '@/game/content/case001-bilingual';

export type LocationId = 'bar_interior' | 'lucia_apartment' | 'argumosa_kiosk';

export interface LocationDef {
  id: LocationId;
  name: BilingualText;
  address: BilingualText;
  background: string;
  caption: BilingualText;
  kicker: BilingualText;
  /** Shown above the scene, e.g. an editorial-style sub-title. */
  byline: BilingualText;
}

export const LOCATIONS: Record<LocationId, LocationDef> = {
  bar_interior: {
    id: 'bar_interior',
    name: { es: 'Taberna La Sirena', en: 'La Sirena Tavern' },
    address: { es: 'Calle del Olivar 14', en: '14 Calle del Olivar' },
    background: '/assets/scenes/bg_bar_interior.png',
    caption: {
      es: 'FIG. 1 — Interior de la taberna, hacia las 23:48. Fotografía oficial de la jefatura.',
      en: 'FIG. 1 — Tavern interior, around 23:48. Official police photograph.',
    },
    kicker: { es: 'La Escena', en: 'The Scene' },
    byline: {
      es: 'Taberna La Sirena · Calle del Olivar 14',
      en: 'La Sirena Tavern · 14 Calle del Olivar',
    },
  },
  lucia_apartment: {
    id: 'lucia_apartment',
    name: { es: 'El Apartamento de Lucía', en: "Lucía's Apartment" },
    address: { es: 'Calle Mesón de Paredes 27, 3º izq.', en: '27 Calle Mesón de Paredes, 3rd floor left' },
    background: '/assets/scenes/bg_lucia_apartment.png',
    caption: {
      es: 'FIG. 2 — Salón del apartamento de Lucía Vargas, registrado al alba del 15 de octubre.',
      en: "FIG. 2 — Living room of Lucía Vargas's apartment, searched at dawn on 15 October.",
    },
    kicker: { es: 'Segundo Escenario', en: 'Second Scene' },
    byline: {
      es: 'Apartamento de Lucía · Mesón de Paredes 27',
      en: "Lucía's Apartment · 27 Mesón de Paredes",
    },
  },
  argumosa_kiosk: {
    id: 'argumosa_kiosk',
    name: { es: 'Kiosko de Argumosa', en: 'Argumosa Newsstand' },
    address: { es: 'Calle Argumosa, junto al Metro de Lavapiés', en: 'Calle Argumosa, beside Lavapiés Metro' },
    background: '/assets/scenes/bg_metro_station.png',
    caption: {
      es: 'FIG. 3 — Kiosko y cabina telefónica de Calle Argumosa, donde la llamada anónima fue registrada a las 00:07.',
      en: 'FIG. 3 — Newsstand and public phone box on Calle Argumosa, where the anonymous call was logged at 00:07.',
    },
    kicker: { es: 'Tercer Escenario', en: 'Third Scene' },
    byline: {
      es: 'Boca del Metro · Calle Argumosa',
      en: 'Metro Entrance · Calle Argumosa',
    },
  },
};

export const DEFAULT_LOCATION_ID: LocationId = 'bar_interior';

export const LOCATION_ORDER: LocationId[] = ['bar_interior', 'lucia_apartment', 'argumosa_kiosk'];

/**
 * Quest IDs that must be completed before each location unlocks. The first
 * scene has no prerequisites; every later scene gates on the previous one.
 */
export const LOCATION_REQUIRED_QUESTS: Record<LocationId, string[]> = {
  bar_interior: [],
  lucia_apartment: ['q1', 'q2', 'q3'],
  argumosa_kiosk: ['q4', 'q5'],
};

export const isLocationUnlocked = (locationId: LocationId, completedQuestIds: string[]): boolean => {
  const required = LOCATION_REQUIRED_QUESTS[locationId];
  return required.every((questId) => completedQuestIds.includes(questId));
};
