import {mathGen} from '../gen/math-gen';
import {Random, fromSeed} from '../random';

import {BaseIdGenerator} from './base-id-generator';
import {randomShortId} from './random-short-id';


/**
 * Simple implementation of ID generator that uses short IDs.
 *
 * @thModule random
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  /**
   * @param rng - The random number generator.
   */
  constructor(private readonly rng: Random = fromSeed(mathGen())) {
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
