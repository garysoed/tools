import {normal} from '../collect/compare/normal';
import {withMap} from '../collect/compare/with-map';
import {$asArray} from '../collect/operators/as-array';
import {$map} from '../collect/operators/map';
import {$sort} from '../collect/operators/sort';
import {$take} from '../collect/operators/take';
import {$zip} from '../collect/operators/zip';
import {$pipe} from '../typescript/pipe';

import {asRandom, Random} from './random';

export function shuffleWeighted<T>(
  items: ReadonlyArray<readonly [T, number]>,
  seed: Random<number>,
): Random<readonly T[]> {
  return seed.takeValues((values) => {
    return asRandom(
      $pipe(
        values,
        $zip(items),
        $map(([randomWeight, [value, weight]]) => ({
          value,
          weight: weight + randomWeight,
        })),
        $take(items.length),
        $sort(withMap(({weight}) => weight, normal())),
        $map(({value}) => value),
        $asArray(),
      ),
    );
  });
}
