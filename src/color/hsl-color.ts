import {mod} from '../math/mod';

import {Color} from './color';

/**
 * `Color` based on its hue, saturation, and lightness.
 *
 * @thModule color
 */
export class HslColor extends Color {
  constructor(hue: number, saturation: number, lightness: number) {
    super(`hsl(${mod(hue, 360)}, ${saturation * 100}, ${lightness * 100})`);
  }
}
