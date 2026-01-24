import {Color as CuloriColor} from 'culori';

import {Color} from './color';

export function toCulori(color: Color): CuloriColor {
  switch (color.space) {
    case 'rgb':
      return {
        b: color.b / 255,
        g: color.g / 255,
        mode: 'rgb',
        r: color.r / 255,
      };
    case 'hsl':
      return {
        h: color.h,
        l: color.l,
        mode: 'hsl',
        s: color.s,
      };
    case 'okhsl':
      return {
        h: color.h,
        l: color.l,
        mode: 'okhsl',
        s: color.s,
      };
    case 'oklab':
      return {
        a: color.a,
        b: color.b,
        l: color.l,
        mode: 'oklab',
      };
    case 'oklch':
      return {
        c: color.c,
        h: color.h,
        l: color.l,
        mode: 'oklch',
      };
  }
}
