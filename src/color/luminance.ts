import {wcagLuminance} from 'culori';

import {Color} from './color';
import {toCulori} from './to-culori';

export function luminance(color: Color): number {
  return wcagLuminance(toCulori(color));
}
