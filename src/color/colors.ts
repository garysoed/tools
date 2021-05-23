import {Result, compose, human} from 'nabu';

import {floatConverter} from '../serializer/float-converter';
import {integerConverter} from '../serializer/integer-converter';
import {percentConverter} from '../serializer/percent-converter';

import {Color} from './color';
import {HslColor} from './hsl-color';
import {RgbColor} from './rgb-color';

const RGB_REGEXP = /^rgb\((.*)\)$/;
const RGBA_REGEXP = /^rgba\((.*)\)$/;
const HSL_REGEXP = /^hsl\((.*)\)$/;
const HSLA_REGEXP = /^hsla\((.*)\)$/;
const HEX_REGEXP = /^#([0-9abcdef]{3,8})$/;

const INTEGER_PARSER = compose(integerConverter(), human());
const FLOAT_PARSER = compose(floatConverter(), human());
const PERCENT_PARSER = percentConverter();

function fromRgb(cssColor: string): Color|null {
  const rgbMatches = RGB_REGEXP.exec(cssColor);
  const rgbaMatches = RGBA_REGEXP.exec(cssColor);
  const matches = rgbMatches === null ? rgbaMatches : rgbMatches;
  if (matches === null) {
    return null;
  }

  const matchString = matches[1];
  let results: Array<Result<number>>;
  if (matchString.indexOf('/') < 0) {
    const list = matchString
        .replace(/ /g, '')
        .split(',')
        .map((match: string, index: number) => {
          return index <= 2
            ? INTEGER_PARSER.convertBackward(match)
            : FLOAT_PARSER.convertBackward(match);
        });
    results = [...list];
  } else {
    const [rgbString] = matchString.split('/');
    const list = rgbString
        .replace(/ +/g, ' ')
        .trim()
        .split(' ')
        .map((match: string) => {
          return INTEGER_PARSER.convertBackward(match.trim());
        });
    results = [...list];
  }

  const resultR = results[0];
  const resultG = results[1];
  const resultB = results[2];
  if (!resultR.success || !resultG.success || !resultB.success) {
    return null;
  }

  return new RgbColor(resultR.result, resultG.result, resultB.result);
}

function fromHsl(cssColor: string): Color|null {
  const hslMatches = HSL_REGEXP.exec(cssColor);
  const hslaMatches = HSLA_REGEXP.exec(cssColor);
  const matches = hslMatches === null ? hslaMatches : hslMatches;
  if (matches === null) {
    return null;
  }

  const matchString = matches[1];
  let results: Array<Result<number>>;
  if (matchString.indexOf('/') < 0) {
    const list = matchString
        .replace(/ /g, '')
        .split(',')
        .slice(0, 3)
        .map((match: string, index: number) => {
          if (index === 0) {
            return INTEGER_PARSER.convertBackward(match);
          } else {
            return PERCENT_PARSER.convertBackward(match);
          }
        });
    results = [...list];
  } else {
    const [hslString] = matchString.split('/');
    const list = hslString
        .replace(/ +/g, ' ')
        .trim()
        .split(' ')
        .map((match: string, index: number) => {
          if (index === 0) {
            return INTEGER_PARSER.convertBackward(match);
          } else {
            return PERCENT_PARSER.convertBackward(match);
          }
        });
    results = [...list];
  }

  const resultH = results[0];
  const resultS = results[1];
  const resultL = results[2];
  if (!resultH.success || !resultS.success || !resultL.success) {
    return null;
  }

  return new HslColor(resultH.result, resultS.result, resultL.result);
}

function fromHex(cssColor: string): Color|null {
  const hexMatches = HEX_REGEXP.exec(cssColor);
  if (hexMatches === null) {
    return null;
  }

  const matches = hexMatches[1];
  let components: number[];
  switch (matches.length) {
    case 3:
    case 4:
      components = matches
          .split('')
          .map((match: string) => {
            return Number.parseInt(`0x${match}${match}`, 16);
          });
      break;
    case 6:
    case 8:
      components = (matches.match(/../g) || [])
          .map((match: string) => {
            return Number.parseInt(`0x${match}`, 16);
          });
      break;
    default:
      return null;
  }

  const r = components[0];
  const g = components[1];
  const b = components[2];
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return new RgbColor(r, g, b);
}

/**
 * Creates a color object from the given CSS color string.
 *
 * @remarks
 * This ignores the alpha attribute and does not work with named colors.
 *
 * @param cssColor - CSS color string.
 * @returns The Color object created from the CSS color string, or null if the string is invalid.
 * @thModule color
 */
export function fromCssColor(cssColor: string): Color|null {
  if (RGB_REGEXP.test(cssColor) || RGBA_REGEXP.test(cssColor)) {
    return fromRgb(cssColor);
  } else if (HSL_REGEXP.test(cssColor) || HSLA_REGEXP.test(cssColor)) {
    return fromHsl(cssColor);
  } else if (HEX_REGEXP.test(cssColor)) {
    return fromHex(cssColor);
  }

  return null;
}

/**
 * Computes the contrast ratio.
 *
 * @param foreground - Foreground color.
 * @param background - Background color.
 * @returns The contrast ratio.
 * @thModule color
 */
export function getContrast(foreground: Color, background: Color): number {
  const fgLuminance = foreground.luminance;
  const bgLuminance = background.luminance;

  return (Math.max(fgLuminance, bgLuminance) + 0.05)
      / (Math.min(fgLuminance, bgLuminance) + 0.05);
}

/**
 * Computes the Euclidean distance between the two colors.
 *
 * @remarks
 * This uses the RGB components to compute the distance. The resulting distance is the square of
 * the distance.
 *
 * @param color1 - First color
 * @param color2 - Second color
 * @returns The Euclidean distance between the two given colors.
 * @thModule color
 */
export function getDistance(color1: Color, color2: Color): number {
  return (color1.red - color2.red) ** 2
      + (color1.green - color2.green) ** 2
      + (color1.blue - color2.blue) ** 2;
}

/**
 * Mixes the two colors together.
 *
 * @remarks
 * This performs additive blending between the two colors.
 *
 * @param color1 - The first color to mix.
 * @param color2 - The second color to mix.
 * @param amount - Ratio of first color to mix.
 * @returns Mixture of the two given colors: color1 * amount + color2 * (1 - amount).
 * @thModule color
 */
export function mix(color1: Color, color2: Color, amount: number): Color {
  return new RgbColor(
      Math.round(color1.red * amount + color2.red * (1 - amount)),
      Math.round(color1.green * amount + color2.green * (1 - amount)),
      Math.round(color1.blue * amount + color2.blue * (1 - amount)));
}

/**
 * Neonize a color.
 *
 * @remarks
 * This picks color among RGBCMY that is the closest to the given color, then does additive blend
 * with that color.
 *
 * @param color - Color to neonize.
 * @param ratio - How close to the neon color the resulting color should be.
 * @returns The neonized color.
 * @thModule color
 */
export function neonize(color: Color, ratio: number): Color {
  const targets = [
    new RgbColor(255, 0, 0),
    new RgbColor(255, 255, 0),
    new RgbColor(0, 255, 0),
    new RgbColor(0, 255, 255),
    new RgbColor(0, 0, 255),
    new RgbColor(255, 0, 255),
  ];

  const colorHue = color.hue;

  let minHueDiff = Number.POSITIVE_INFINITY;
  let selectedTarget = null;
  for (const target of targets) {
    const hueDiff = Math.abs(target.hue - colorHue);
    if (hueDiff < minHueDiff) {
      minHueDiff = hueDiff;
      selectedTarget = target;
    }
  }

  if (!selectedTarget) {
    return color;
  }

  return mix(selectedTarget, color, ratio);
}
