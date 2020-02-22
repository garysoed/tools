import { numberType, stringType } from 'gs-types';

import { byType } from './by-type';
import { CompareResult } from './compare-result';
import { compound } from './compound';
import { normal } from './normal';
import { Ordering } from './ordering';

const SPLIT_REGEXP = /([0-9]+)/;

/**
 * Natural ordering that pays attention to numerical values in the string.
 */
export function natural(): Ordering<string> {
  return (item1: string, item2: string): CompareResult => {
    const item1Chunks = item1.split(SPLIT_REGEXP);
    const item2Chunks = item2.split(SPLIT_REGEXP);
    const maxLength = Math.min(item1Chunks.length, item2Chunks.length);
    const ordering = compound<any>([
      byType([numberType, stringType]),
      normal(),
    ]);

    function normalize(str: string): number|string {
      const parseResult = parseFloat(str);

      return isNaN(parseResult) ? str : parseResult;
    }

    for (let i = 0; i < maxLength; i++) {
      const result = ordering(normalize(item1Chunks[i]), normalize(item2Chunks[i]));
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
}
