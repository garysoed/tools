import Colorizr from 'colorizr';

import {Color, ColorSpace, ColorSpaceMap} from './color';

export function fromColorizr<S extends ColorSpace>(
  colorizr: Colorizr,
  space: S,
): ColorSpaceMap[S];
export function fromColorizr(colorizr: Colorizr, space: ColorSpace): Color {
  switch (space) {
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
