import type { Application } from 'pixi.js';
import { Vector2 } from '../utils/Vector2';
import type { Hero } from '../entities/Hero';

/**
 * Listens to canvas clicks and tells the hero where to go.
 */
export class InputManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly app: Application;
  private readonly hero: Hero;
  private readonly onPointerDown: (e: PointerEvent) => void;

  constructor(app: Application, hero: Hero) {
    this.app = app;
    this.canvas = app.view as HTMLCanvasElement;
    this.hero = hero;

    this.onPointerDown = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.app.screen.width / rect.width;
      const scaleY = this.app.screen.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      this.hero.moveTo(Vector2.from(x, y));
    };

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
  }

  destroy(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
  }
}
