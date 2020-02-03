import { BaseIdGenerator } from '../random/base-id-generator';

import { randomShortId } from './operators/random-short-id';
import { RandomGenerator } from './random-generator';
import { mathSeed } from './seed/math-seed';


/**
 * Simple implementation of ID generator that uses short IDs.
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  constructor(private rng: RandomGenerator = new RandomGenerator(mathSeed())) {
    super();
  }

  protected newId(): string {
    const [id, next] = randomShortId(this.rng);
    this.rng = next;
    return id;
  }

  protected resolveConflict(id: string): string {
    const [nextId, next] = randomShortId(this.rng);
    this.rng = next;
    return `${id}-${nextId}`;
  }
}
