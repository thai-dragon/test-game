import { Graphics } from 'pixi.js';
import { Entity } from './Entity';
import { Vector2 } from '../utils/Vector2';
import { GameConfig } from '../config/GameConfig';

/**
 * Player hero. Moves toward the last click position.
 */
export class Hero extends Entity {
  private targetPosition: Vector2;
  private readonly speed = GameConfig.hero.speed;
  private readonly arrivalThreshold = GameConfig.arrivalThreshold;

  constructor(x: number, y: number) {
    super(x, y);
    this.targetPosition = new Vector2(x, y);
    this.buildGraphics();
  }

  moveTo(target: Vector2): void {
    this.targetPosition = target.clone();
  }

  update(deltaMs: number): void {
    const dir = this.targetPosition.subtract(this.position);
    const dist = dir.magnitude;

    if (dist <= this.arrivalThreshold) return;

    const step = (this.speed * deltaMs) / 1000;
    const newPos = dist <= step
      ? this.targetPosition.clone()
      : this.position.add(dir.normalized.scale(step));

    if (dir.x < 0) {
      this.container.scale.x = -1;
      this.container.rotation = Math.atan2(-dir.y, -dir.x);
    } else if (dir.x > 0) {
      this.container.scale.x = 1;
      this.container.rotation = Math.atan2(dir.y, dir.x);
    }
    this.setPosition(newPos);
  }

  private buildGraphics(): void {
    const g = new Graphics();

    // Body
    g.lineStyle(2, 0xB8860B, 1);
    g.beginFill(0xF5C018);
    g.drawEllipse(0, 2, 21, 13);
    g.endFill();

    // Wing highlight
    g.lineStyle(1, 0xB8860B, 0.4);
    g.beginFill(0xFFD740, 0.6);
    g.drawEllipse(-2, 2, 13, 8);
    g.endFill();

    // Head
    g.lineStyle(2, 0xB8860B, 1);
    g.beginFill(0xF5C018);
    g.drawCircle(18, -8, 10);
    g.endFill();

    // Bill
    g.lineStyle(0);
    g.beginFill(0xFF6600);
    g.drawPolygon([25, -12, 34, -9, 25, -6]);
    g.endFill();

    // Eye
    g.beginFill(0x1A1A1A);
    g.drawCircle(21, -11, 2.5);
    g.endFill();

    // Eye shine
    g.beginFill(0xFFFFFF);
    g.drawCircle(22, -12, 1);
    g.endFill();

    this.container.addChild(g);
  }
}
