import type { IBehavior } from './IBehavior';
import { Vector2 } from '../utils/Vector2';
import { GameConfig } from '../config/GameConfig';

/**
 * Moves toward a leader (hero or another animal) and stops at the spacing distance.
 */
export class FollowBehavior implements IBehavior {
  private readonly getLeaderPosition: () => Vector2;
  private readonly spacing: number;
  private readonly speed = GameConfig.animal.speed;

  constructor(getLeaderPosition: () => Vector2, spacing = GameConfig.animal.followSpacing) {
    this.getLeaderPosition = getLeaderPosition;
    this.spacing = spacing;
  }

  update(position: Vector2, deltaMs: number): Vector2 {
    const leaderPos = this.getLeaderPosition();
    const dir = leaderPos.subtract(position);
    const dist = dir.magnitude;

    if (dist <= this.spacing) return position.clone();

    const step = (this.speed * deltaMs) / 1000;
    const moveDir = dir.normalized;

    if (dist - step <= this.spacing) {
      return leaderPos.subtract(moveDir.scale(this.spacing));
    }

    return position.add(moveDir.scale(step));
  }

  reset(): void {}
}
