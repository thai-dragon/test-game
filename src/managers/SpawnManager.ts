import type { Container } from 'pixi.js';
import { Animal } from '../entities/Animal';
import { GameConfig } from '../config/GameConfig';
import { randomRange } from '../utils/MathUtils';

/**
 * Spawns new animals on a random interval up to the field cap.
 */
export class SpawnManager {
  private readonly worldLayer: Container;
  private readonly onSpawn: (animal: Animal) => void;
  private timer: number = 0;
  private nextInterval: number;

  constructor(worldLayer: Container, onSpawn: (animal: Animal) => void) {
    this.worldLayer = worldLayer;
    this.onSpawn = onSpawn;
    this.nextInterval = this.rollInterval();
  }

  update(deltaMs: number, currentAnimalCount: number): void {
    if (currentAnimalCount >= GameConfig.spawn.maxOnField) return;

    this.timer += deltaMs;
    if (this.timer < this.nextInterval) return;

    this.timer = 0;
    this.nextInterval = this.rollInterval();
    this.spawnAnimal();
  }

  private spawnAnimal(): void {
    const x = randomRange(60, GameConfig.width - 60);
    const y = randomRange(160, GameConfig.height - 60);
    const animal = new Animal(x, y);
    this.worldLayer.addChild(animal.container);
    this.onSpawn(animal);
  }

  private rollInterval(): number {
    const { min, max } = GameConfig.spawn.intervalMs;
    return randomRange(min, max);
  }
}
