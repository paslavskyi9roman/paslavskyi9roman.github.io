import * as Phaser from 'phaser';

type Npc = {
  id: 'npc_lucia_vargas' | 'npc_diego_torres' | 'npc_inspectora_ruiz';
  name: string;
  x: number;
  y: number;
};

export class InvestigationScene extends Phaser.Scene {
  constructor() {
    super('InvestigationScene');
  }

  preload() {
    this.load.image('bg_bar_exterior', '/assets/scenes/bg_bar_exterior.png');
    this.load.image('detective', '/assets/characters/detective.png');
    this.load.image('npc_lucia_vargas', '/assets/characters/npc_lucia_vargas.png');
    this.load.image('npc_diego_torres', '/assets/characters/npc_diego_torres.png');
    this.load.image('npc_inspectora_ruiz', '/assets/characters/npc_inspectora_ruiz.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const bg = this.add.image(width / 2, height / 2, 'bg_bar_exterior');
    const cover = Math.max(width / bg.width, height / bg.height);
    bg.setScale(cover);

    const characterDisplayHeight = height * 0.35;

    const detectiveFeetY = height * 0.72 + 28;
    const detective = this.add.image(width * 0.35, detectiveFeetY, 'detective').setOrigin(0.5, 1);
    detective.setScale(characterDisplayHeight / detective.height);

    const npcs: Npc[] = [
      { id: 'npc_lucia_vargas', name: 'Lucía', x: width * 0.62, y: height * 0.7 },
      { id: 'npc_diego_torres', name: 'Diego', x: width * 0.75, y: height * 0.68 },
      { id: 'npc_inspectora_ruiz', name: 'Ruiz', x: width * 0.52, y: height * 0.66 },
    ];

    npcs.forEach((npc) => {
      const feetY = npc.y + 28;
      const sprite = this.add.image(npc.x, feetY, npc.id).setOrigin(0.5, 1);
      sprite.setScale(characterDisplayHeight / sprite.height);
      this.add.text(npc.x - 22, feetY + 4, npc.name, { fontSize: '12px', color: '#e2e8f0' });
      sprite.setInteractive({ useHandCursor: true });
      sprite.on('pointerdown', () => {
        window.dispatchEvent(new CustomEvent('madrid-noir:npc-selected', { detail: { npcId: npc.id } }));
      });
    });

    const clues = [
      {
        x: width * 0.75,
        y: height * 0.83,
        id: 'clue_receipt',
        title: 'Ticket del Metro',
        description: 'Un ticket válido después de la hora declarada por Lucía.',
      },
      {
        x: width * 0.52,
        y: height * 0.84,
        id: 'clue_glass',
        title: 'Vaso con huellas',
        description: 'Las huellas coinciden con una persona no registrada en el bar.',
      },
      {
        x: width * 0.66,
        y: height * 0.86,
        id: 'clue_note',
        title: 'Nota rasgada',
        description: 'Fragmento con la frase: "23:40 salida trasera".',
      },
    ];

    clues.forEach((item, index) => {
      const clue = this.add.rectangle(item.x, item.y, 18, 18, 0xfde68a).setStrokeStyle(2, 0xfef3c7);
      this.add.text(item.x - 18, item.y + 18, `Clue ${index + 1}`, { fontSize: '11px', color: '#fde68a' });
      clue.setInteractive({ useHandCursor: true });
      clue.on('pointerdown', () => {
        window.dispatchEvent(new CustomEvent('madrid-noir:clue-found', { detail: item }));
      });
    });

    this.add.text(width * 0.02, height * 0.03, 'Haz click en NPCs y pistas para expandir la investigación.', {
      fontSize: '14px',
      color: '#fef3c7',
    });
  }
}
