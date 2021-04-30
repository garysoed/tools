import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {SimpleIdGenerator} from './simple-id-generator';


test('@tools/random/idgenerators/simple-id-generator', () => {
  test('generate', () => {
    should('generate the ID correctly', () => {
      const seed = new FakeSeed([13 / 62]);
      const generator = new SimpleIdGenerator(fromSeed(seed));

      assert(generator.generate(['DDDDDDD', 'DDDDDDD-DDDDDDD', 'DDDDDDD-DDDDDDD-DDDDDDD']))
          .to.equal('DDDDDDD-DDDDDDD-DDDDDDD-DDDDDDD');
    });
  });

});
