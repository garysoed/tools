export interface RgbColor {
  // 0 - 255
  readonly b: number;
  // 0 - 255
  readonly g: number;
  // 0 - 255
  readonly r: number;
  readonly space: 'rgb';
}

export interface HslColor {
  // 0 - 360. undefined for achromatic colors
  readonly h?: number;
  // 0 - 1
  readonly l: number;
  // 0 - 1
  readonly s: number;
  readonly space: 'hsl';
}

export interface OklchColor {
  // 0 - 1
  readonly c: number;
  // 0 - 1. undefined for achromatic colors
  readonly h?: number;
  // 0 - 1
  readonly l: number;
  readonly space: 'oklch';
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

export interface OkhslColor {
  // 0 - 360. undefined for achromatic colors
  readonly h?: number;
  // 0 - 1
  readonly l: number;
  // 0 - 1
  readonly s: number;
  readonly space: 'okhsl';
}

export interface ColorSpaceMap {
  readonly hsl: HslColor;
  readonly okhsl: OkhslColor;
  readonly oklab: OklabColor;
  readonly oklch: OklchColor;
  readonly rgb: RgbColor;
}

export type Color = ColorSpaceMap[keyof ColorSpaceMap];

export type ColorSpace = keyof ColorSpaceMap;

// TODO: Add alpha
