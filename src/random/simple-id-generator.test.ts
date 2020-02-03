import { assert, should } from '@gs-testing';

import { RandomGenerator } from './random-generator';
import { SimpleIdGenerator } from './simple-id-generator';
import { fakeSeed } from './testing/fake-seed';


describe('random.SimpleIdGenerator', () => {
  describe('generate', () => {
    should(`generate the ID correctly`, () => {
      const seed = fakeSeed([13 / 62]);
      const generator = new SimpleIdGenerator(new RandomGenerator(seed));

      assert(generator.generate(['DDDDDDD', 'DDDDDDD-DDDDDDD', 'DDDDDDD-DDDDDDD-DDDDDDD']))
          .to.equal('DDDDDDD-DDDDDDD-DDDDDDD-DDDDDDD');
    });
  });
});
