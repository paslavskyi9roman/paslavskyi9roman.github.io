import * as Phaser from 'phaser';

export class InvestigationScene extends Phaser.Scene {
  constructor() {
    super('InvestigationScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x101522);
    this.add.rectangle(width * 0.2, height * 0.75, width * 0.3, height * 0.35, 0x161d2d);
    this.add.rectangle(width * 0.8, height * 0.7, width * 0.4, height * 0.4, 0x1a2336);

    this.add.circle(width * 0.5, height * 0.18, 70, 0xffd166, 0.08);

    this.add.rectangle(width * 0.35, height * 0.72, 28, 56, 0x5dade2).setStrokeStyle(2, 0x94d2ff);
    this.add.text(width * 0.31, height * 0.79, 'Detective', { fontSize: '12px', color: '#cbd5e1' });

    const npcs = [
      { id: 'npc_lucia_vargas', name: 'Lucía', x: width * 0.62, y: height * 0.7, fill: 0xe76f51, stroke: 0xfca5a5 },
      { id: 'npc_diego_torres', name: 'Diego', x: width * 0.75, y: height * 0.68, fill: 0xf4a261, stroke: 0xfed7aa },
      { id: 'npc_inspectora_ruiz', name: 'Ruiz', x: width * 0.52, y: height * 0.66, fill: 0x8ab4f8, stroke: 0xbfdbfe },
    ];

    npcs.forEach((npc) => {
      const sprite = this.add.rectangle(npc.x, npc.y, 28, 56, npc.fill).setStrokeStyle(2, npc.stroke);
      this.add.text(npc.x - 22, npc.y + 36, npc.name, { fontSize: '12px', color: '#e2e8f0' });
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
