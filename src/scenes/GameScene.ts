import { Container, Graphics, TilingSprite } from 'pixi.js';
import type { Application } from 'pixi.js';
import { Scene } from '../core/Scene';
import { EventEmitter } from '../core/EventEmitter';
import type { GameEventMap } from '../core/GameEvents';
import { GameConfig } from '../config/GameConfig';
import { EntityFactory } from '../factories/EntityFactory';
import { GroupManager } from '../managers/GroupManager';
import { ScoreManager } from '../managers/ScoreManager';
import { InputManager } from '../managers/InputManager';
import { SpawnManager } from '../managers/SpawnManager';
import type { Hero } from '../entities/Hero';
import type { Animal } from '../entities/Animal';
import type { Yard } from '../entities/Yard';

/**
 * Main game scene. Sets up entities/managers and runs the per-frame update.
 */
export class GameScene extends Scene {
  private readonly events = new EventEmitter<GameEventMap>();

  private worldLayer!: Container;
  private uiLayer!: Container;

  private hero!: Hero;
  private yard!: Yard;
  private animals: Animal[] = [];

  private groupManager!: GroupManager;
  private scoreManager!: ScoreManager;
  private inputManager!: InputManager;
  private spawnManager!: SpawnManager;

  constructor(app: Application) {
    super(app);
  }

  init(): void {
    this.buildLayers();
    this.buildBackground();

    this.yard = EntityFactory.createYard(this.worldLayer);
    this.hero = EntityFactory.createHero(this.worldLayer);

    const initialAnimals = EntityFactory.createInitialAnimals(
      this.worldLayer,
      GameConfig.spawn.initialCount,
    );
    this.animals.push(...initialAnimals);

    this.groupManager = new GroupManager(this.hero, this.events);
    this.scoreManager = new ScoreManager(this.events);
    this.inputManager = new InputManager(this.app, this.hero);
    this.spawnManager = new SpawnManager(this.worldLayer, (animal) => {
      this.animals.push(animal);
    });

    this.uiLayer.addChild(this.scoreManager.container);
  }

  update(deltaMs: number): void {
    this.hero.update(deltaMs);

    for (const animal of this.animals) {
      animal.update(deltaMs);
    }

    this.groupManager.tryCollectNearby(this.animals);

    this.checkYardDeliveries();

    this.spawnManager.update(deltaMs, this.animals.length);

    this.scoreManager.updateGroupDisplay(
      this.groupManager.size,
      GameConfig.maxGroupSize,
    );
  }

  destroy(): void {
    this.inputManager.destroy();
    this.scoreManager.destroy();
    this.events.removeAllListeners();
    this.app.stage.removeChildren();
  }

  private checkYardDeliveries(): void {
    const toDeliver: Animal[] = [];

    for (const animal of this.groupManager.getAnimals()) {
      if (this.yard.contains(animal.getPosition())) {
        toDeliver.push(animal);
      }
    }

    for (const animal of toDeliver) {
      this.deliverAnimal(animal);
    }
  }

  private deliverAnimal(animal: Animal): void {
    this.groupManager.remove(animal);
    this.removeAnimal(animal);
    this.events.emit('animal:delivered', { animal });
    animal.destroy();
  }

  private removeAnimal(animal: Animal): void {
    const idx = this.animals.indexOf(animal);
    if (idx !== -1) this.animals.splice(idx, 1);
  }

  private buildLayers(): void {
    this.worldLayer = new Container();
    this.uiLayer = new Container();
    this.app.stage.addChild(this.worldLayer);
    this.app.stage.addChild(this.uiLayer);
  }

  private buildBackground(): void {
    const tileSize = 64;
    const tileGfx = new Graphics();

    tileGfx.beginFill(GameConfig.backgroundColor);
    tileGfx.drawRect(0, 0, tileSize, tileSize);
    tileGfx.endFill();

    const shades = [0x245a24, 0x326e32, 0x287028, 0x1e5a1e, 0x387838, 0x2a6a2a];
    for (let i = 0; i < 22; i++) {
      const x = Math.random() * tileSize;
      const y = Math.random() * tileSize;
      const shade = shades[Math.floor(Math.random() * shades.length)];
      tileGfx.beginFill(shade, 0.45 + Math.random() * 0.35);
      tileGfx.drawRect(x, y, 2 + Math.random() * 7, 1 + Math.random() * 2);
      tileGfx.endFill();
    }

    const texture = this.app.renderer.generateTexture(tileGfx);
    tileGfx.destroy();

    const grass = new TilingSprite(texture, GameConfig.width, GameConfig.height);
    this.worldLayer.addChild(grass);
  }
}
