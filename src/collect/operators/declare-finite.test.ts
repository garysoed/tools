import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { asArray } from './as-array';
import { declareFinite } from './declare-finite';

test('collect.operators.declareFinite', () => {
  should(`declare the generator as finite`, () => {
    assert(() => {
      exec(
          function *(): IterableIterator<number> {
            yield* [1, 2, 3];
          },
          declareFinite(),
          asArray(),
      );
    }).toNot.throw();
  });
});
