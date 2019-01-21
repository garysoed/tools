import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { toArray } from '../generators';
import { declareFinite } from './declare-finite';

test('collect.operators.declareFinite', () => {
  should(`declare the generator as finite`, () => {
    assert(() => {
      const generator = exec(
          function *(): IterableIterator<number> {
            yield* [1, 2, 3];
          },
          declareFinite(),
      );
      toArray(generator);
    }).toNot.throw();
  });
});
