import { Container, Text, TextStyle, Graphics } from 'pixi.js';
import { GameConfig } from '../config/GameConfig';
import type { EventEmitter } from '../core/EventEmitter';
import type { GameEventMap } from '../core/GameEvents';

/**
 * Score counter and HUD panel.
 */
export class ScoreManager {
  readonly container: Container;
  private score = 0;
  private scoreLabel!: Text;
  private groupLabel!: Text;
  private readonly events: EventEmitter<GameEventMap>;
  private readonly onDelivered: () => void;

  constructor(events: EventEmitter<GameEventMap>) {
    this.events = events;
    this.container = new Container();
    this.buildHUD();

    this.onDelivered = () => {
      this.score++;
      this.refreshScore();
    };
    this.events.on('animal:delivered', this.onDelivered);
  }

  updateGroupDisplay(groupSize: number, maxSize: number): void {
    this.groupLabel.text = `Group: ${groupSize}/${maxSize}`;
  }

  destroy(): void {
    this.events.off('animal:delivered', this.onDelivered);
    this.container.destroy({ children: true });
  }

  private buildHUD(): void {
    const panelW = 260;
    const panelH = 44;
    const panelX = GameConfig.width / 2 - panelW / 2;
    const panelY = 8;

    const bg = new Graphics();
    bg.beginFill(0x000000, 0.45);
    bg.drawRoundedRect(0, 0, panelW, panelH, 10);
    bg.endFill();
    bg.x = panelX;
    bg.y = panelY;

    const style = new TextStyle({
      fontFamily: GameConfig.ui.fontFamily,
      fontSize: GameConfig.ui.fontSize,
      fontWeight: 'bold',
      fill: GameConfig.ui.fontColor,
      dropShadow: true,
      dropShadowDistance: 2,
      dropShadowAlpha: 0.6,
    });

    this.scoreLabel = new Text('Score: 0', style);
    this.scoreLabel.x = panelX + 14;
    this.scoreLabel.y = panelY + 10;

    this.groupLabel = new Text('Group: 0/5', style);
    this.groupLabel.x = panelX + 145;
    this.groupLabel.y = panelY + 10;

    this.container.addChild(bg, this.scoreLabel, this.groupLabel);
  }

  private refreshScore(): void {
    this.scoreLabel.text = `Score: ${this.score}`;
  }
}
