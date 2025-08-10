export interface RgbColor {
  // 0 - 255
  readonly b: number;
  // 0 - 255
  readonly g: number;
  // 0 - 255
  readonly r: number;
  readonly space: 'rgb';
}

export function rgb(input: Omit<RgbColor, 'space'>): RgbColor {
  return {
    ...input,
    space: 'rgb',
  };
}

export interface HslColor {
  // 0 - 360
  readonly h: number;
  // 0 - 1
  readonly l: number;
  // 0 - 1
  readonly s: number;
  readonly space: 'hsl';
}
export function hsl(input: Omit<HslColor, 'space'>): HslColor {
  return {
    ...input,
    space: 'hsl',
  };
}

export interface OklchColor {
  // 0 - 1
  readonly c: number;
  // 0 - 1
  readonly h: number;
  // 0 - 1
  readonly l: number;
  readonly space: 'oklch';
}
export function oklch(input: Omit<OklchColor, 'space'>): OklchColor {
  return {
    ...input,
    space: 'oklch',
  };
}

export interface OklabColor {
  // 0 - 1
  readonly a: number;
  // 0 - 1
  readonly b: number;
  // 0 - 1
  readonly l: number;
  readonly space: 'oklab';
}
export function oklab(input: Omit<OklabColor, 'space'>): OklabColor {
  return {
    ...input,
    space: 'oklab',
  };
}

export interface ColorSpaceMap {
  readonly hsl: HslColor;
  readonly oklab: OklabColor;
  readonly oklch: OklchColor;
  readonly rgb: RgbColor;
}

export type Color = ColorSpaceMap[keyof ColorSpaceMap];

export type ColorSpace = keyof ColorSpaceMap;
