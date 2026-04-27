import type { Animal } from '../entities/Animal';

export interface GameEventMap {
  'animal:collected': { animal: Animal };
  'animal:delivered': { animal: Animal };
  'score:changed': { score: number };
  'group:full': Record<string, never>;
}
