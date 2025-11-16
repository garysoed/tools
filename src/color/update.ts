import {Color, ColorSpace, ColorSpaceMap} from './color';
import {convert} from './convert';

type Updater<C extends Color> = (color: C) => Partial<C>;

export function update<S extends ColorSpace>(
  from: Color,
  space: S,
  updater: Updater<ColorSpaceMap[S]>,
): ColorSpaceMap[S] {
  const convertedFrom = convert(from, space);
  return {...convertedFrom, ...updater(convertedFrom)};
}
