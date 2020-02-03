import { BaseIdGenerator } from '../random/base-id-generator';

import { RandomGenerator } from './random-generator';
import { shortId } from './randomizer';
import { mathSeed } from './seed/math-seed';


/**
 * Simple implementation of ID generator that uses short IDs.
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  constructor(private rng: RandomGenerator = new RandomGenerator(mathSeed())) {
    super();
  }

  protected newId(): string {
    const [id, next] = shortId(this.rng);
    this.rng = next;
    return id;
  }

  protected resolveConflict(id: string): string {
    const [nextId, next] = shortId(this.rng);
    this.rng = next;
    return `${id}-${nextId}`;
  }
}
