import { NumberType, StringType, Type } from 'gs-types/export';
import { ImmutableList } from '../immutable/immutable-list';
import { CompareResult } from '../interfaces/compare-result';
import { Ordering } from '../interfaces/ordering';
import { FloatParser } from '../parse/float-parser';

const NATURAL_SPLIT_REGEXP = /([0-9]+)/;

export const Orderings = {
  compound<T>(orderings: Iterable<Ordering<T>>): Ordering<T> {
    return (item1: T, item2: T): CompareResult => {
      for (const ordering of orderings) {
        const result = ordering(item1, item2);
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    };
  },

  map<T1, T2>(mapFn: (input: T1) => T2, ordering: Ordering<T2>): Ordering<T1> {
    return (item1: T1, item2: T1): CompareResult => {
      return ordering(mapFn(item1), mapFn(item2));
    };
  },

  matches<T>(matchFn: (input: T) => boolean): Ordering<T> {
    return (item1: T, item2: T): CompareResult => {
      const matches1 = matchFn(item1);
      const matches2 = matchFn(item2);
      if (matches1 === matches2) {
        return 0;
      }

      return (matches1 && !matches2) ? -1 : 1;
    };
  },

  /**
   * Orders items matching the given list at the start of the list.
   * @param checked
   */
  isOneOf<T>(checked: Iterable<T>): Ordering<T> {
    const checkedSet = new Set(checked);
    return Orderings.matches(item => checkedSet.has(item));
  },

  /**
   * Natural ordering that pays attention to numerical values in the string.
   */
  natural(): Ordering<string> {
    return (item1: string, item2: string): CompareResult => {
      const item1Chunks = item1.split(NATURAL_SPLIT_REGEXP);
      const item2Chunks = item2.split(NATURAL_SPLIT_REGEXP);
      const maxLength = Math.min(item1Chunks.length, item2Chunks.length);
      const ordering = Orderings
          .compound<any>(ImmutableList.of([
            Orderings.type(ImmutableList.of([NumberType, StringType])),
            Orderings.normal(),
          ]));

      function normalize(str: string): number | string {
        const parsed = FloatParser.parse(str);
        return parsed === null ? str : parsed;
      }

      for (let i = 0; i < maxLength; i++) {
        const result = ordering(normalize(item1Chunks[i]), normalize(item2Chunks[i]));
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    };
  },

  /**
   * Ordering by comparators `<` and `>`.
   *
   * For numbers, this is the natural ordering of the number.
   * For strings, this is the alphabetical ordering.
   * For booleans, this ordering treats `false` as smaller.
   */
  normal<T>(): Ordering<T> {
    return (item1: T, item2: T): CompareResult => {
      if (item1 < item2) {
        return -1;
      } else if (item1 > item2) {
        return 1;
      } else {
        return 0;
      }
    };
  },

  /**
   * Reverses the given ordering.
   */
  reverse<T>(ordering: Ordering<T>): Ordering<T> {
    return (item1: T, item2: T): CompareResult => {
      return ordering(item2, item1);
    };
  },

  /**
   * Order the items by the types.
   */
  type(types: Iterable<Type<any>>): Ordering<any> {
    return (item1: any, item2: any): CompareResult => {
      for (const type of types) {
        const passes1 = type.check(item1);
        const passes2 = type.check(item2);
        if (passes1 !== passes2) {
          return Orderings.reverse(Orderings.normal())(passes1, passes2);
        }
      }

      return 0;
    };
  },
};
