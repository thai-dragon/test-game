import type { IBehavior } from './IBehavior';
import { Vector2 } from '../utils/Vector2';
import { GameConfig } from '../config/GameConfig';
import { randomRange } from '../utils/MathUtils';

/**
 * Walks between random waypoints around an origin point with a short pause between them.
 */
export class PatrolBehavior implements IBehavior {
  private origin: Vector2;
  private waypoint: Vector2;
  private idleTimer: number = 0;
  private readonly speed = GameConfig.animal.patrolSpeed;
  private readonly radius = GameConfig.animal.patrolRadius;

  constructor(origin: Vector2) {
    this.origin = origin.clone();
    this.waypoint = this.pickWaypoint();
  }

  update(position: Vector2, deltaMs: number): Vector2 {
    if (this.idleTimer > 0) {
      this.idleTimer -= deltaMs;
      return position.clone();
    }

    const dir = this.waypoint.subtract(position);
    const dist = dir.magnitude;
    const step = (this.speed * deltaMs) / 1000;

    if (dist <= step) {
      const reached = this.waypoint.clone();
      this.scheduleNextWaypoint();
      return reached;
    }

    return position.add(dir.normalized.scale(step));
  }

  reset(): void {
    this.waypoint = this.pickWaypoint();
    this.idleTimer = 0;
  }

  private pickWaypoint(): Vector2 {
    const angle = randomRange(0, Math.PI * 2);
    const distance = randomRange(this.radius * 0.3, this.radius);
    const wx = this.origin.x + Math.cos(angle) * distance;
    const wy = this.origin.y + Math.sin(angle) * distance;
    return new Vector2(
      Math.max(20, Math.min(GameConfig.width - 20, wx)),
      Math.max(20, Math.min(GameConfig.height - 20, wy)),
    );
  }

  private scheduleNextWaypoint(): void {
    const cfg = GameConfig.animal.patrolChangeIntervalMs;
    this.idleTimer = randomRange(cfg.min, cfg.max);
    this.waypoint = this.pickWaypoint();
  }
}
