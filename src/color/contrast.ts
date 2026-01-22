import {wcagContrast} from 'culori';

import {Color} from './color';
import {toCulori} from './to-culori';

export function contrast(color1: Color, color2: Color): number {
  return wcagContrast(toCulori(color1), toCulori(color2));
}
