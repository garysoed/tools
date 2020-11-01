import { $pipe } from '../../collect/operators/pipe';
import { Random } from '../random';
import { asArray } from '../../collect/operators/as-array';
import { map } from '../../collect/operators/map';
import { normal } from '../../collect/compare/normal';
import { sort } from '../../collect/operators/sort';
import { withMap } from '../../collect/compare/with-map';
import { zip } from '../../collect/operators/zip';

export function shuffle<T>(
    items: readonly T[],
    rng: Random,
    getBaseWeight: (item: T) => number = () => 0,
): readonly T[] {
  return $pipe(
      items,
      zip(rng.iterable()),
      map(([item, randomWeight]) => {
        return {item, weight: getBaseWeight(item) + randomWeight};
      }),
      asArray(),
      sort(withMap(({weight}) => weight, normal())),
      map(({item}) => item),
      asArray(),
  );
}
