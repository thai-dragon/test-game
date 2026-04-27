import type { Container } from 'pixi.js';
import { Animal } from '../entities/Animal';
import { Hero } from '../entities/Hero';
import { Yard } from '../entities/Yard';
import { GameConfig } from '../config/GameConfig';
import { randomRange } from '../utils/MathUtils';

/**
 * Creates entities and adds them to the world layer.
 */
export class EntityFactory {
  static createHero(worldLayer: Container): Hero {
    const hero = new Hero(GameConfig.width / 2, GameConfig.height / 2);
    worldLayer.addChild(hero.container);
    return hero;
  }

  static createYard(worldLayer: Container): Yard {
    const yard = new Yard();
    worldLayer.addChild(yard.container);
    return yard;
  }

  static createInitialAnimals(worldLayer: Container, count: number): Animal[] {
    const yardCfg = GameConfig.yard;
    const animals: Animal[] = [];

    for (let i = 0; i < count; i++) {
      let x: number;
      let y: number;

      // Keep animals out of the yard area at spawn
      do {
        x = randomRange(50, GameConfig.width - 50);
        y = randomRange(160, GameConfig.height - 50);
      } while (
        x >= yardCfg.x - 30 && x <= yardCfg.x + yardCfg.width + 30 &&
        y >= yardCfg.y - 30 && y <= yardCfg.y + yardCfg.height + 30
      );

      const animal = new Animal(x, y);
      worldLayer.addChild(animal.container);
      animals.push(animal);
    }

    return animals;
  }
}
