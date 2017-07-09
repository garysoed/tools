import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { Promises } from '../async/promises';
import { ImmutableSet } from '../immutable/immutable-set';


describe('async.Promises', () => {
  describe('forFiniteCollection', () => {
    it(`should transform the collection correctly`, async () => {
      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      const promise1 = Promise.resolve(value1);
      const promise2 = Promise.resolve(value2);
      assert(await Promises.forFiniteCollection(ImmutableSet.of([promise1, promise2])))
          .to.haveElements([value1, value2]);
    });
  });
});
