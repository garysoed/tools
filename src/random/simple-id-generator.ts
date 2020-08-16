import { BaseIdGenerator } from './base-id-generator';
import { randomShortId } from './operators/random-short-id';
import { fromSeed, Random } from './random';
import { mathSeed } from './seed/math-seed';


/**
 * Simple implementation of ID generator that uses short IDs.
 *
 * @thModule random
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  /**
   * @param rng - The random number generator.
   */
  constructor(private rng: Random<unknown> = fromSeed(mathSeed())) {
    super();
  }

  /**
   * {@inheritDoc BaseIdGenerator.newId}
   */
  protected newId(): string {
    const rng = randomShortId(this.rng);
    this.rng = rng;
    return rng.value;
  }

  /**
   * {@inheritDoc BaseIdGenerator.resolveConflict}
   */
  protected resolveConflict(id: string): string {
    const rng = randomShortId(this.rng);
    this.rng = rng;
    return `${id}-${rng.value}`;
  }
}
