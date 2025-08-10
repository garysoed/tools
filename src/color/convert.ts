import {Color, ColorSpace, ColorSpaceMap} from './color';
import {toColorizr} from './to-colorizr';

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
