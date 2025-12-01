import {Color} from './color';
import {toColorizr} from './to-colorizr';

export function luminance(color: Color): number {
  return toColorizr(color).luminance;
}
