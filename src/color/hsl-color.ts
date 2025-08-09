import {mod} from '../math/mod';

import {Color} from './color';
import {safeStringifyNumber} from './safe-stringify-number';

/**
 * `Color` based on its hue, saturation, and lightness.
 *
 * @thModule color
 */
export class HslColor extends Color {
  constructor(hue: number, saturation: number, lightness: number) {
    const params = [mod(hue, 360), saturation * 100, lightness * 100]
      .map((n) => safeStringifyNumber(n))
      .join(', ');
    super(`hsl(${params})`);
  }
}
