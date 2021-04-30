import {$map} from '../../collect/operators/map';
import {Operator} from '../../collect/operators/operator';
import {$pipe} from '../../collect/operators/pipe';

import {$pickIntByFraction} from './pick-int-by-fraction';


/**
 * Picks an item randomly from the given list.
 *
 * @param values The list to pick the value from.
 * @return An operator that takes in an iterable of positional fractions and returns an iterable of
 *     items at the position.
 */
export function $pickItemByFraction<T>(
    values: readonly T[],
): Operator<Iterable<number>, Iterable<T|undefined>> {
  return fractions => {
    return $pipe(
        fractions,
        $pickIntByFraction(0, values.length),
        $map(index => values[index]),
    );
  };
}
