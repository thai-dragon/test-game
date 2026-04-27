import { Graphics } from 'pixi.js';
import { Entity } from './Entity';
import { Vector2 } from '../utils/Vector2';
import { GameConfig } from '../config/GameConfig';
import type { IBehavior } from '../behaviors/IBehavior';
import { IdleBehavior } from '../behaviors/IdleBehavior';
import { PatrolBehavior } from '../behaviors/PatrolBehavior';
import { FollowBehavior } from '../behaviors/FollowBehavior';
import { randomRange } from '../utils/MathUtils';

export const enum AnimalState {
  Idle = 'idle',
  Patrol = 'patrol',
  Following = 'following',
}

/**
 * Animal entity. Swaps its movement behavior as the state changes.
 */
export class Animal extends Entity {
  private state: AnimalState = AnimalState.Idle;
  private behavior: IBehavior;
  private stateTimer: number = 0;

  constructor(x: number, y: number) {
    super(x, y);
    this.behavior = this.pickInitialBehavior();
    this.buildGraphics();
  }

  getState(): AnimalState {
    return this.state;
  }

  startFollowing(getLeaderPosition: () => Vector2): void {
    this.behavior = new FollowBehavior(getLeaderPosition);
    this.state = AnimalState.Following;
  }

  stopFollowing(): void {
    this.state = AnimalState.Patrol;
    this.behavior = new PatrolBehavior(this.position.clone());
    this.behavior.reset();
  }

  update(deltaMs: number): void {
    if (this.state !== AnimalState.Following) {
      this.tickIdlePatrolCycle(deltaMs);
    }

    const newPos = this.behavior.update(this.position, deltaMs);

    const dir = newPos.subtract(this.position);
    if (dir.magnitude > 0.1) {
      if (dir.x < 0) {
        this.container.scale.x = -1;
        this.container.rotation = Math.atan2(-dir.y, -dir.x);
      } else if (dir.x > 0) {
        this.container.scale.x = 1;
        this.container.rotation = Math.atan2(dir.y, dir.x);
      }
    }

    this.setPosition(newPos);
  }

  private tickIdlePatrolCycle(deltaMs: number): void {
    this.stateTimer -= deltaMs;
    if (this.stateTimer > 0) return;

    if (this.state === AnimalState.Idle) {
      this.state = AnimalState.Patrol;
      this.behavior = new PatrolBehavior(this.position.clone());
      const cfg = GameConfig.animal.patrolChangeIntervalMs;
      this.stateTimer = randomRange(cfg.min, cfg.max);
    } else {
      this.state = AnimalState.Idle;
      this.behavior = new IdleBehavior();
      const cfg = GameConfig.animal.idleDurationMs;
      this.stateTimer = randomRange(cfg.min, cfg.max);
    }
  }

  private pickInitialBehavior(): IBehavior {
    const cfg = GameConfig.animal.idleDurationMs;
    this.stateTimer = randomRange(cfg.min, cfg.max);
    if (Math.random() < 0.5) {
      this.state = AnimalState.Idle;
      return new IdleBehavior();
    }
    this.state = AnimalState.Patrol;
    return new PatrolBehavior(this.position.clone());
  }

  private buildGraphics(): void {
    const g = new Graphics();

    // Body
    g.lineStyle(1.5, 0xCCA000, 1);
    g.beginFill(0xFFE040);
    g.drawEllipse(0, 1, 13, 9);
    g.endFill();

    // Head
    g.beginFill(0xFFE040);
    g.drawCircle(11, -6, 8);
    g.endFill();

    // Bill
    g.lineStyle(0);
    g.beginFill(0xFF7700);
    g.drawPolygon([17, -9, 22, -7, 17, -5]);
    g.endFill();

    // Eye
    g.beginFill(0x1A1A1A);
    g.drawCircle(13, -8, 1.5);
    g.endFill();

    // Eye shine
    g.beginFill(0xFFFFFF);
    g.drawCircle(14, -9, 0.6);
    g.endFill();

    this.container.addChild(g);
  }
}
