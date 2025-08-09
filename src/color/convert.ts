import Colorizr from 'colorizr';

import {Color, ColorSpace, ColorSpaceMap} from './color';

export function convert<T extends ColorSpace>(
  from: Color,
  to: T,
): ColorSpaceMap[T];
export function convert(from: Color, to: ColorSpace): Color {
  const colorizr = toColorizr(from);

  switch (to) {
    case 'rgb':
      return {
        ...colorizr.rgb,
        space: 'rgb',
      };
    case 'hsl': {
      const hsl = colorizr.hsl;
      return {
        h: hsl.h,
        l: hsl.l / 100,
        s: hsl.s / 100,
        space: 'hsl',
      };
    }
    case 'oklch':
      return {
        ...colorizr.oklch,
        space: 'oklch',
      };
    case 'oklab':
      return {
        ...colorizr.oklab,
        space: 'oklab',
      };
  }
}

function toColorizr(color: Color): Colorizr {
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
