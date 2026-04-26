import Phaser from 'phaser';

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

    this.add.rectangle(width * 0.62, height * 0.7, 28, 56, 0xe76f51).setStrokeStyle(2, 0xfca5a5);
    this.add.text(width * 0.57, height * 0.79, 'Lucía', { fontSize: '12px', color: '#fecaca' });

    const clue = this.add.rectangle(width * 0.75, height * 0.83, 18, 18, 0xfde68a).setStrokeStyle(2, 0xfef3c7);
    this.add.text(width * 0.69, height * 0.89, 'Clue', { fontSize: '12px', color: '#fde68a' });

    clue.setInteractive({ useHandCursor: true });
    clue.on('pointerdown', () => {
      window.dispatchEvent(
        new CustomEvent('madrid-noir:clue-found', {
          detail: {
            id: 'clue_receipt',
            title: 'Ticket del Metro',
            description: 'Un ticket válido después de la hora declarada por Lucía.',
          },
        }),
      );
    });

    // NEEDS VERIFICATION: Phaser 4 API
  }
}
