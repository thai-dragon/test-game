import type { Vector2 } from '../utils/Vector2';

/**
 * Movement behavior. Returns the next position for the entity.
 */
export interface IBehavior {
  update(position: Vector2, deltaMs: number): Vector2;
  reset(): void;
}
