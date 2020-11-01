import { BaseIdGenerator } from './base-id-generator';


/**
 * ID generator where the generated IDs are sequential.
 *
 * @thModule random
 */
export class SequentialIdGenerator extends BaseIdGenerator {
  private value = 0;

  constructor() {
    super();
  }

  /**
   * {@inheritDoc BaseIdGenerator.newId}
   */
  protected newId(): string {
    this.value++;
    return `${this.value}`;
  }

  /**
   * {@inheritDoc BaseIdGenerator.resolveConflict}
   */
  protected resolveConflict(id: string): string {
    this.value++;
    return `${id}-${this.value}`;
  }
}
