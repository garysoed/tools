import Colorizr from 'colorizr';

import {
  Color,
  ColorSpace,
  HslColor,
  OklabColor,
  OklchColor,
  RgbColor,
} from './color';
import {convert} from './convert';
import {fromColorizr} from './from-colorizr';

type OptionalSpace<T extends Color> = Omit<T, 'space'> & {
  readonly space?: T['space'];
};
type Input<T extends Color> = Color | OptionalSpace<T> | string;

export function rgb(input: Input<RgbColor>): RgbColor {
  if (typeof input === 'string') {
    return fromColorizr(new Colorizr(input), 'rgb');
  }
  if (isColor(input)) {
    return convert(input, 'rgb');
  }
  return {...input, space: 'rgb'};
}

export function hsl(input: Input<HslColor>): HslColor {
  if (typeof input === 'string') {
    return fromColorizr(new Colorizr(input), 'hsl');
  }
  if (isColor(input)) {
    return convert(input, 'hsl');
  }
  return {...input, space: 'hsl'};
}

export function oklab(input: Input<OklabColor>): OklabColor {
  if (typeof input === 'string') {
    return fromColorizr(new Colorizr(input), 'oklab');
  }
  if (isColor(input)) {
    return convert(input, 'oklab');
  }
  return {...input, space: 'oklab'};
}

export function oklch(input: Input<OklchColor>): OklchColor {
  if (typeof input === 'string') {
    return fromColorizr(new Colorizr(input), 'oklch');
  }
  if (isColor(input)) {
    return convert(input, 'oklch');
  }
  return {...input, space: 'oklch'};
}

interface MaybeColor {
  readonly space?: ColorSpace;
}
function isColor(maybeColor: MaybeColor): maybeColor is Color {
  return maybeColor.space !== undefined;
}
