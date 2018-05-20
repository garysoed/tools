import { BaseIdGenerator } from '../random/base-id-generator';
import { Randomizer, RandomizerImpl } from '../random/randomizer';


/**
 * Simple implementation of ID generator that uses short IDs.
 */
export class SimpleIdGenerator extends BaseIdGenerator {
  constructor(private readonly random_: RandomizerImpl = Randomizer()) {
    super();
  }

  protected newId_(): string {
    return this.random_.shortId();
  }

  protected resolveConflict_(id: string): string {
    return `${id}-${this.random_.shortId()}`;
  }
}
