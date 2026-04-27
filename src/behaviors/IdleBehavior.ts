import type { IBehavior } from './IBehavior';
import { Vector2 } from '../utils/Vector2';

export class IdleBehavior implements IBehavior {
  update(position: Vector2, _deltaMs: number): Vector2 {
    return position.clone();
  }

  reset(): void {}
}
