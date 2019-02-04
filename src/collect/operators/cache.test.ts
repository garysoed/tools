import { assert, should, test } from 'gs-testing/export/main';
import { createSpy, fake, resetCalls } from 'gs-testing/export/spy';
import { pipe } from '../pipe';
import { createImmutableList } from '../types/immutable-list';
import { cache } from './cache';
import { head } from './head';
import { map } from './map';

test('gs-tools.collect.operators.cache', () => {
  should(`cache correctly`, () => {
    const mapSpy = createSpy<number, [number]>('map');
    fake(mapSpy).always().call(n => n + 1);

    const cached = pipe(createImmutableList([1, 2, 3]), map(mapSpy), cache());
    assert(pipe(cached, head())).to.equal(2);

    resetCalls(mapSpy);
    assert([...cached()]).to.haveExactElements([2, 3, 4]);
    assert(mapSpy).toNot.haveBeenCalledWith(1);
  });

  should(`handle reiteration during iteration`, () => {
    const mapSpy = createSpy<number, [number]>('map');
    fake(mapSpy).always().call(n => {
      return n + 1;
    });

    const cached = pipe(createImmutableList([1, 2, 3]), map(mapSpy), cache());

    const mapped = pipe(
        cached,
        map(item => {
          // tslint:disable-next-line:no-non-null-assertion
          return item + pipe(cached, head())!;
        }),
    );
    assert([...mapped()]).to.haveExactElements([4, 5, 6]);
    assert(mapSpy).toNot.haveBeenCalled(4);
  });
});
