import { Spec } from './spec';


export class Solve {
  /**
   * Finds the treshold for the given function.
   *
   * This takes in a specification of value, and a function that checks the value tested. The given
   * specification must indicate a range of numbers. The given function must take one of these
   * values, and return true / false. Note that the function must by monotonic. If must group the
   * true and false values together.
   *
   * For example, functions that return: True True True False False (in that order) or ok. But
   * functions that return: True True False True True is not allowed.
   *
   * This method will try to find the value where True switches from / to False.
   *
   * @param spec The specification of the values. This must be a finite number.
   * @param fn The function to check the truthfulness.
   * @param trueAtLowerValues boolean True iff the function returns true at lower values.
   * @return The value where the given function switches between True and False, or null if it is
   *    not found.
   */
  static findThreshold(
      spec: Spec,
      fn: (value: number) => boolean,
      trueAtLowerValues: boolean): (number|null) {
    const values = spec.generateValues();
    let startIndex = 0;
    let endIndex = values.length - 1;
    let bestIndex: (number|null) = null;
    while (startIndex <= endIndex) {
      const guessIndex = Math.floor((startIndex + endIndex) / 2);
      const result = fn(values[guessIndex]) ;

      if (result) {
        if (bestIndex === null) {
          bestIndex = guessIndex;
        }

        if (trueAtLowerValues) {
          bestIndex = Math.max(bestIndex, guessIndex);
        } else {
          bestIndex = Math.min(bestIndex, guessIndex);
        }
      }

      if (result === trueAtLowerValues) {
        startIndex = guessIndex + 1;
      } else {
        endIndex = guessIndex - 1;
      }
    }

    return bestIndex === null ? null : values[bestIndex];
  }
}
// TODO: Mutable
