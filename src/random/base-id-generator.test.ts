import { assert, should } from '@gs-testing/main';
import { BaseIdGenerator } from './base-id-generator';

/**
 * @test
 */
class TestIdGenerator extends BaseIdGenerator {
  protected newId_(): string {
    return `1`;
  }

  protected resolveConflict_(id: string): string {
    return `${parseInt(id, 10) + 1}`;
  }
}

describe('random.BaseIdGenerator', () => {
  let generator: BaseIdGenerator;

  beforeEach(() => {
    generator = new TestIdGenerator();
  });

  describe('generate', () => {
    should('keep resolving ID conflict until it is different', () => {
      assert(generator.generate(['1', '2', '3'])).to.equal('4');
    });
  });
});
