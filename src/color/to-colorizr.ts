import Colorizr from 'colorizr';

import {Color} from './color';

export function toColorizr(color: Color): Colorizr {
  switch (color.space) {
    case 'rgb':
      return new Colorizr({
        b: color.b,
        g: color.g,
        r: color.r,
      });
    case 'hsl':
      return new Colorizr({
        h: color.h,
        l: color.l * 100,
        s: color.s * 100,
      });
    case 'oklch':
      return new Colorizr({
        c: color.c,
        h: color.h,
        l: color.l,
      });
    case 'oklab':
      return new Colorizr({
        a: color.a,
        b: color.b,
        l: color.l,
      });
  }
}
