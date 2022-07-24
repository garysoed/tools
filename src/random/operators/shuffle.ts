import {normal} from '../../collect/compare/normal';
import {withMap} from '../../collect/compare/with-map';
import {$asArray} from '../../collect/operators/as-array';
import {$map} from '../../collect/operators/map';
import {$sort} from '../../collect/operators/sort';
import {$pipe} from '../../typescript/pipe';
import {Random} from '../random';

export function shuffle<T>(
    items: readonly T[],
    rng: Random,
    getBaseWeight: (item: T) => number = () => 0,
): readonly T[] {
  return $pipe(
      items,
      $map(item => ({item, weight: getBaseWeight(item) + rng.next()})),
      $asArray(),
      $sort(withMap(({weight}) => weight, normal())),
      $map(({item}) => item),
      $asArray(),
  );
}
