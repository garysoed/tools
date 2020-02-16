import { BaseIdGenerator } from '../random/base-id-generator';

import { randomShortId } from './operators/random-short-id';
import { fromSeed, Random } from './random';
import { mathSeed } from './seed/math-seed';


/**
 * Simple implementation of ID generator that uses short IDs.
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  constructor(private rng: Random<unknown> = fromSeed(mathSeed())) {
    super();
  }

  protected newId(): string {
    const rng = randomShortId(this.rng);
    this.rng = rng;
    return rng.value;
  }

  protected resolveConflict(id: string): string {
    const rng = randomShortId(this.rng);
    this.rng = rng;
    return `${id}-${rng.value}`;
  }
}
