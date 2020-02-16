import { assert, should } from '@gs-testing';

import { fromSeed } from './random';
import { SimpleIdGenerator } from './simple-id-generator';
import { FakeSeed } from './testing/fake-seed';


describe('random.SimpleIdGenerator', () => {
  describe('generate', () => {
    should(`generate the ID correctly`, () => {
      const seed = new FakeSeed([13 / 62]);
      const generator = new SimpleIdGenerator(fromSeed(seed));

      assert(generator.generate(['DDDDDDD', 'DDDDDDD-DDDDDDD', 'DDDDDDD-DDDDDDD-DDDDDDD']))
          .to.equal('DDDDDDD-DDDDDDD-DDDDDDD-DDDDDDD');
    });
  });
});
