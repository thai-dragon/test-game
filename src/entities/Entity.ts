import { Container } from 'pixi.js';
import { Vector2 } from '../utils/Vector2';

/**
 * Base class for anything that has a position and a PIXI container.
 */
export abstract class Entity {
  readonly id: string;
  readonly container: Container;
  protected position: Vector2;

  constructor(x: number, y: number) {
    this.id = crypto.randomUUID();
    this.container = new Container();
    this.position = new Vector2(x, y);
    this.container.x = x;
    this.container.y = y;
  }

  getPosition(): Vector2 {
    return this.position.clone();
  }

  setPosition(pos: Vector2): void {
    this.position.copyFrom(pos);
    this.container.x = pos.x;
    this.container.y = pos.y;
  }

  abstract update(deltaMs: number): void;

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
