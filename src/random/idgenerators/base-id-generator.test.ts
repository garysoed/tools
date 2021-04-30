import {assert, should, test} from 'gs-testing';

import {BaseIdGenerator} from './base-id-generator';

/**
 * @test
 */
class TestIdGenerator extends BaseIdGenerator {
  protected newId(): string {
    return '1';
  }

  protected resolveConflict(id: string): string {
    return `${parseInt(id, 10) + 1}`;
  }
}

test('@tools/random/idgenerators/base-id-generator', init => {
  const _ = init(() => {
    return {generator: new TestIdGenerator()};
  });

  test('generate', () => {
    should('keep resolving ID conflict until it is different', () => {
      assert(_.generator.generate(['1', '2', '3'])).to.equal('4');
    });
  });
});
