import { assert, should, test } from '@gs-testing';
import { createSpy, fake, resetCalls } from '@gs-testing';
import { pipe } from '../pipe';
import { createImmutableList } from '../types/immutable-list';
import { eager } from './eager-finite';
import { map } from './map';

test('gs-tools.collect.operators.eagerFinite', () => {
  should(`eagerly iterates through all the members and cache them`, () => {
    const mapFn = createSpy<number, [number]>('map');
    fake(mapFn).always().call(n => n * 2);

    const mapped = pipe(createImmutableList([1, 2, 3]), map(mapFn), eager());
    assert(mapFn).to.haveBeenCalled(3);

    resetCalls(mapFn);
    assert([...mapped()]).to.haveExactElements([2, 4, 6]);
    assert(mapFn).toNot.haveBeenCalled();
  });
});
