import {contrast as colorizrContrast} from 'colorizr';

import {Color} from './color';
import {toColorizr} from './to-colorizr';

export function contrast(color1: Color, color2: Color): number {
  return colorizrContrast(toColorizr(color1).css, toColorizr(color2).css);
}
