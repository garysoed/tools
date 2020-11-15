import {BaseIdGenerator} from './base-id-generator';
import {randomShortId} from './operators/random-short-id';
import {Random, fromSeed} from './random';
import {mathSeed} from './seed/math-seed';


/**
 * Simple implementation of ID generator that uses short IDs.
 *
 * @thModule random
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  /**
   * @param rng - The random number generator.
   */
  constructor(private readonly rng: Random = fromSeed(mathSeed())) {
    super();
  }

  /**
   * {@inheritDoc BaseIdGenerator.newId}
   */
  protected newId(): string {
    return randomShortId(this.rng);
  }

  /**
   * {@inheritDoc BaseIdGenerator.resolveConflict}
   */
  protected resolveConflict(id: string): string {
    return `${id}-${randomShortId(this.rng)}`;
  }
}
