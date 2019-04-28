import { assert, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createImmutableList } from '../types/immutable-list';
import { createImmutableMap } from '../types/immutable-map';
import { createInfiniteList } from '../types/infinite-list';
import { createInfiniteMap } from '../types/infinite-map';
import { asArray } from './as-array';

test('gs-tools.collect.operators.asArray', () => {
  should(`throw error if applied to infinite list`, () => {
    assert(() => {
      pipe(
          createInfiniteList([1, 2, 3]),
          asArray(),
      );
    }).to.throwErrorWithMessage(/finite/);
  });

  should(`throw error if applied to infinite map`, () => {
    assert(() => {
      pipe(
          createInfiniteMap([['a', 1], ['b', 2], ['c', 3]]),
          asArray(),
      );
    }).to.throwErrorWithMessage(/finite/);
  });

  should(`convert ImmutableLists correctly`, () => {
    assert(
        pipe(
            createImmutableList([1, 2, 3]),
            asArray(),
        ),
    ).to.haveExactElements([1, 2, 3]);
  });

  should(`convert ImmutableMaps correctly`, () => {
    const array = pipe(
        createImmutableMap([['a', 1], ['b', 2], ['c', 3]]),
        asArray(),
    );

    assert(array.length).to.equal(3);
    assert(array[0][0]).to.equal('a');
    assert(array[0][1]).to.equal(1);
    assert(array[1][0]).to.equal('b');
    assert(array[1][1]).to.equal(2);
    assert(array[2][0]).to.equal('c');
    assert(array[2][1]).to.equal(3);
  });
});
