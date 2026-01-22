import {parse, Color as CuloriColor} from 'culori';

import {
  Color,
  ColorSpace,
  HslColor,
  OklabColor,
  OklchColor,
  RgbColor,
} from './color';
import {convert} from './convert';

type OptionalSpace<T extends Color> = Omit<T, 'space'> & {
  readonly space?: T['space'];
};
type Input<T extends Color> = Color | OptionalSpace<T> | string;

export function rgb(input: Input<RgbColor>): RgbColor {
  if (typeof input === 'string') {
    const culori = maybeParse(input, 'rgb');
    return {
      b: culori.b * 255,
      g: culori.g * 255,
      r: culori.r * 255,
      space: 'rgb',
    };
  }
  if (isColor(input)) {
    return convert(input, 'rgb');
  }
  return {...input, space: 'rgb'};
}

export function hsl(input: Input<HslColor>): HslColor {
  if (typeof input === 'string') {
    const culori = maybeParse(input, 'hsl');
    return {
      h: culori.h,
      l: culori.l,
      s: culori.s,
      space: 'hsl',
    };
  }
  if (isColor(input)) {
    return convert(input, 'hsl');
  }
  return {...input, space: 'hsl'};
}

export function oklab(input: Input<OklabColor>): OklabColor {
  if (typeof input === 'string') {
    const culori = maybeParse(input, 'oklab');
    return {
      a: culori.a,
      b: culori.b,
      l: culori.l,
      space: 'oklab',
    };
  }
  if (isColor(input)) {
    return convert(input, 'oklab');
  }
  return {...input, space: 'oklab'};
}

export function oklch(input: Input<OklchColor>): OklchColor {
  if (typeof input === 'string') {
    const culori = maybeParse(input, 'oklch');
    return {
      c: culori.c,
      h: culori.h,
      l: culori.l,
      space: 'oklch',
    };
  }
  if (isColor(input)) {
    return convert(input, 'oklch');
  }
  return {...input, space: 'oklch'};
}

type CuloriMode = CuloriColor['mode'];
type CuloriOf<Mode extends CuloriMode> = CuloriColor & {readonly mode: Mode};
function maybeParse<Mode extends CuloriMode>(
  input: string,
  mode: Mode,
): CuloriOf<Mode> {
  const result = parse(input);
  if (!result) {
    throw new Error(`Failed to parse color ${input}`);
  }
  if (result.mode !== mode) {
    throw new Error(`Color ${input} is not in mode ${mode}`);
  }
  return result as CuloriOf<Mode>;
}

interface MaybeColor {
  readonly space?: ColorSpace;
}
function isColor(maybeColor: MaybeColor): maybeColor is Color {
  return maybeColor.space !== undefined;
}
