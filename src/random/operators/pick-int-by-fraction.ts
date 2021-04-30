import {$map} from '../../collect/operators/map';
import {Operator} from '../../collect/operators/operator';

/**
 * Picks an integer in the given interval with the given fractional position.
 *
 * @param from The start interval (inclusive).
 * @param to The end interval (exclusive).
 * @return Operator that takes in an iterable of fractions and returns an iterable of integers
 *    picked in the specified range at the specified fractional position.
 */
export function $pickIntByFraction(
    from: number,
    to: number,
): Operator<Iterable<number>, Iterable<number>> {
  return $map(fraction => {
    return from + Math.floor(fraction * (to - from));
  });
}
