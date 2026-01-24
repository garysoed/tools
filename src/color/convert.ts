import {converter} from 'culori';

import {Color, ColorSpace, ColorSpaceMap} from './color';
import {toCulori} from './to-culori';

export function convert<T extends ColorSpace>(
  from: Color,
  to: T,
): ColorSpaceMap[T];
export function convert(from: Color, to: ColorSpace): Color {
  const culori = toCulori(from);
  const converted = converter(to)(culori);

  switch (converted.mode) {
    case 'rgb':
      return {
        b: converted.b * 255,
        g: converted.g * 255,
        r: converted.r * 255,
        space: 'rgb',
      };
    case 'hsl': {
      return {
        h: converted.h,
        l: converted.l,
        s: converted.s,
        space: 'hsl',
      };
    }
    case 'okhsl':
      return {
        h: converted.h,
        l: converted.l,
        s: converted.s,
        space: 'okhsl',
      };
    case 'oklch':
      return {
        c: converted.c,
        h: converted.h,
        l: converted.l,
        space: 'oklch',
      };
    case 'oklab':
      return {
        a: converted.a,
        b: converted.b,
        l: converted.l,
        space: 'oklab',
      };
  }
}
