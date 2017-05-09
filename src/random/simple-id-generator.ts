import { BaseIdGenerator } from '../random/base-id-generator';
import { Random, Randomizer } from '../random/randomizer';


/**
 * Simple implementation of ID generator that uses short IDs.
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  private readonly random_: Randomizer;

  constructor() {
    super();
    this.random_ = Random();
  }

  /**
   * @override
   */
  newId_(): string {
    return this.random_.shortId();
  }

  /**
   * @override
   */
  resolveConflict_(id: string): string {
    return `${id}-${this.random_.shortId()}`;
  }
}
// TODO: Mutable
