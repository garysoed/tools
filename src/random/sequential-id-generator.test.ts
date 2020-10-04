import { assert, should, test } from 'gs-testing';

import { SequentialIdGenerator } from './sequential-id-generator';


test('@tools/random/sequential-id-generator', () => {
  test('generate', () => {
    should(`generate the ID correctly`, () => {
      const generator = new SequentialIdGenerator();

      assert(generator.generate(['1', '1-2'])).to.equal('1-2-3');
    });
  });
});
