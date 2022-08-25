import {normal} from '../collect/compare/normal';
import {withMap} from '../collect/compare/with-map';
import {$asArray} from '../collect/operators/as-array';
import {$map} from '../collect/operators/map';
import {$sort} from '../collect/operators/sort';
import {$take} from '../collect/operators/take';
import {$zip} from '../collect/operators/zip';
import {$pipe} from '../typescript/pipe';

import {asRandom, Random} from './random';

export function shuffle<T>(orig: readonly T[], randomGen: Random<number>): Random<readonly T[]> {
  return randomGen.takeValues(values => {
    return asRandom($pipe(
        orig,
        $zip(values),
        $map(([value, weight]) => ({value, weight})),
        $take(orig.length),
        $sort(withMap(({weight}) => weight, normal())),
        $map(({value}) => value),
        $asArray(),
    ));
  });
}