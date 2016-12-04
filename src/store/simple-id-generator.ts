import {IdGenerator} from './interfaces';
import {Random, Randomizer} from '../random/randomizer';


/**
 * Simple implementation of ID generator that uses short IDs.
 */
export class SimpleIdGenerator implements IdGenerator {
  private readonly random_: Randomizer;

  constructor() {
    this.random_ = Random();
  }

  /**
   * @override
   */
  generate(): string {
    return this.random_.shortId();
  }

  /**
   * @override
   */
  resolveConflict(id: string): string {
    return `${id}-${this.random_.shortId()}`;
  }
}
