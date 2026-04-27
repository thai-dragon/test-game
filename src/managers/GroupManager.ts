import type { Hero } from '../entities/Hero';
import { Animal, AnimalState } from '../entities/Animal';
import { GameConfig } from '../config/GameConfig';
import type { EventEmitter } from '../core/EventEmitter';
import type { GameEventMap } from '../core/GameEvents';

/**
 * Holds the chain of animals following the hero.
 * First animal follows the hero, each next one follows the previous animal.
 */
export class GroupManager {
  private readonly group: Animal[] = [];
  private readonly hero: Hero;
  private readonly events: EventEmitter<GameEventMap>;
  private readonly maxSize = GameConfig.maxGroupSize;

  constructor(hero: Hero, events: EventEmitter<GameEventMap>) {
    this.hero = hero;
    this.events = events;
  }

  get size(): number {
    return this.group.length;
  }

  get isFull(): boolean {
    return this.group.length >= this.maxSize;
  }

  getAnimals(): readonly Animal[] {
    return this.group;
  }

  tryAdd(animal: Animal): boolean {
    if (this.isFull) {
      this.events.emit('group:full', {});
      return false;
    }
    if (this.group.includes(animal)) return false;

    const leaderIndex = this.group.length - 1;
    const getLeaderPos = leaderIndex < 0
      ? () => this.hero.getPosition()
      : () => this.group[leaderIndex].getPosition();

    animal.startFollowing(getLeaderPos);
    this.group.push(animal);
    this.events.emit('animal:collected', { animal });
    return true;
  }

  remove(animal: Animal): void {
    const idx = this.group.indexOf(animal);
    if (idx === -1) return;

    this.group.splice(idx, 1);

    // Re-wire followers after removed slot
    for (let i = idx; i < this.group.length; i++) {
      const prevLeaderPos = i === 0
        ? () => this.hero.getPosition()
        : (() => {
            const captured = i - 1;
            return () => this.group[captured].getPosition();
          })();
      this.group[i].startFollowing(prevLeaderPos);
    }
  }

  contains(animal: Animal): boolean {
    return this.group.includes(animal);
  }

  tryCollectNearby(animals: readonly Animal[]): void {
    if (this.isFull) return;
    const heroPos = this.hero.getPosition();
    const collectR = GameConfig.hero.collectRadius;

    for (const animal of animals) {
      if (this.isFull) break;
      if (this.contains(animal)) continue;
      if (animal.getState() === AnimalState.Following) continue;

      const dist = heroPos.distanceTo(animal.getPosition());
      if (dist <= collectR) {
        this.tryAdd(animal);
      }
    }
  }
}
