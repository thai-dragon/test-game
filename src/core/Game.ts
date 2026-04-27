import { Application } from 'pixi.js';
import { GameConfig } from '../config/GameConfig';
import { GameScene } from '../scenes/GameScene';

export class Game {
  private readonly app: Application;
  private scene!: GameScene;

  constructor() {
    this.app = new Application({
      width: GameConfig.width,
      height: GameConfig.height,
      backgroundColor: GameConfig.backgroundColor,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
  }

  init(): void {
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.scene = new GameScene(this.app);
    this.scene.init();

    this.app.ticker.add((delta) => {
      const deltaMs = delta * (1000 / 60);
      this.scene.update(deltaMs);
    });
  }
}
