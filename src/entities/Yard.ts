import { Graphics } from 'pixi.js';
import { Entity } from './Entity';
import { Vector2 } from '../utils/Vector2';
import { GameConfig } from '../config/GameConfig';

/**
 * Destination area. Just a hit-box plus the fence drawing.
 */
export class Yard extends Entity {
  private readonly width: number;
  private readonly height: number;

  constructor() {
    const cfg = GameConfig.yard;
    super(cfg.x, cfg.y);
    this.width = cfg.width;
    this.height = cfg.height;
    this.buildGraphics();
  }

  contains(worldPos: Vector2): boolean {
    const cfg = GameConfig.yard;
    return (
      worldPos.x >= cfg.x &&
      worldPos.x <= cfg.x + this.width &&
      worldPos.y >= cfg.y &&
      worldPos.y <= cfg.y + this.height
    );
  }

  update(_deltaMs: number): void {}

  private buildGraphics(): void {
    const w = this.width;
    const h = this.height;
    const g = new Graphics();

    const RAIL = 0xA06030;
    const POST = 0x7A4520;
    const POST_DARK = 0x3A2008;
    const GATE_Y1 = Math.round(h * 0.32);
    const GATE_Y2 = Math.round(h * 0.68);

    // Floor
    g.beginFill(0xC8A040, 0.75);
    g.drawRect(0, 0, w, h);
    g.endFill();

    // Rails
    g.lineStyle(3, RAIL, 1);
    g.moveTo(0, 5);       g.lineTo(w, 5);         // top upper
    g.moveTo(0, 11);      g.lineTo(w, 11);        // top lower
    g.moveTo(0, h - 5);   g.lineTo(w, h - 5);    // bottom upper
    g.moveTo(0, h - 11);  g.lineTo(w, h - 11);   // bottom lower
    g.moveTo(w - 5, 0);   g.lineTo(w - 5, h);    // right outer
    g.moveTo(w - 11, 0);  g.lineTo(w - 11, h);   // right inner
    // left side, above the gate
    g.moveTo(5, 0);       g.lineTo(5, GATE_Y1);
    g.moveTo(11, 0);      g.lineTo(11, GATE_Y1);
    // left side, below the gate
    g.moveTo(5, GATE_Y2); g.lineTo(5, h);
    g.moveTo(11, GATE_Y2); g.lineTo(11, h);

    // Posts
    const post = (cx: number, cy: number) => {
      g.lineStyle(1.5, POST_DARK, 1);
      g.beginFill(POST);
      g.drawRect(cx - 5, cy - 5, 10, 10);
      g.endFill();
    };

    post(0, 0);        post(w, 0);
    post(0, h);        post(w, h);
    post(w / 2, 0);    post(w / 2, h);
    post(w, h / 2);
    post(0, GATE_Y1);  post(0, GATE_Y2);

    this.container.addChild(g);
  }
}
