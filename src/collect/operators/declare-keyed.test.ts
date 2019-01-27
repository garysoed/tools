import { assert, should, test } from 'gs-testing/export/main';
import { getKey } from '../generators';
import { pipe } from '../pipe';
import { declareKeyed } from './declare-keyed';

test('collect.operators.declareKeyed', () => {
  should(`declare the generator as keyed`, () => {
    const generator = pipe(
        function *(): IterableIterator<number> {
          yield 12;
        },
        declareKeyed(value => `${value}`),
    );
    assert(getKey(generator, 12)).to.equal(`12`);
  });
});
