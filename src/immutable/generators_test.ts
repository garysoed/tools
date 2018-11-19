import { assert, should } from 'gs-testing/export/main';
import { Generators } from '../immutable/generators';


describe('immutable.Generators', () => {
  describe('ranged', () => {
    should('generate the correct iterable', () => {
      assert(Generators.ranged(3, 3, 14)).to.startWith([3, 6, 9, 12]);
    });

    should('throw error if "to" is less than "from"', () => {
      assert(() => {
        for (const _ of Generators.ranged(10, 3, 3)) { }
      }).to.throwErrorWithMessage(/must be <=/);
    });
  });
});
