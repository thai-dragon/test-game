import type { Application } from 'pixi.js';

/**
 * Base class for game scenes.
 */
export abstract class Scene {
  protected readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  abstract init(): void;

  abstract update(deltaMs: number): void;

  abstract destroy(): void;
}
