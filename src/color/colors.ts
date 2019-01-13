import { human } from 'nabu/export/grammar';
import { Result } from 'nabu/export/main';
import { compose } from 'nabu/export/util';
import { floatConverter } from '../serializer/float-converter';
import { integerConverter } from '../serializer/integer-converter';
import { percentConverter } from '../serializer/percent-converter';
import { Color } from './color';
import { HslColor } from './hsl-color';
import { RgbColor } from './rgb-color';

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
          return index <= 2 ?
              INTEGER_PARSER.convertBackward(match) :
              FLOAT_PARSER.convertBackward(match);
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

  return RgbColor.newInstance(resultR.result, resultG.result, resultB.result);
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

  return HslColor.newInstance(resultH.result, resultS.result, resultL.result);
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

  return RgbColor.newInstance(r, g, b);
}

export const Colors = {
  /**
   * Creates a color object from the given CSS color string.
   *
   * This ignores the alpha attribute and does not work with named colors.
   * @param cssColor CSS color string.
   * @return The Color object created from the CSS color string, or null if the string is invalid.
   */
  fromCssColor(cssColor: string): Color|null {
    if (RGB_REGEXP.test(cssColor) || RGBA_REGEXP.test(cssColor)) {
      return fromRgb(cssColor);
    } else if (HSL_REGEXP.test(cssColor) || HSLA_REGEXP.test(cssColor)) {
      return fromHsl(cssColor);
    } else if (HEX_REGEXP.test(cssColor)) {
      return fromHex(cssColor);
    }

    return null;
  },

  /**
   * @param foreground Foreground color.
   * @param background Background color.
   * @return The contrast ratio.
   */
  getContrast(foreground: Color, background: Color): number {
    const fgLuminance = foreground.getLuminance();
    const bgLuminance = background.getLuminance();

    return (Math.max(fgLuminance, bgLuminance) + 0.05)
        / (Math.min(fgLuminance, bgLuminance) + 0.05);
  },

  getDistance(color1: Color, color2: Color): number {
    return (color1.getRed() - color2.getRed()) ** 2
        + (color1.getGreen() - color2.getGreen()) ** 2
        + (color1.getBlue() - color2.getBlue()) ** 2;
  },

  /**
   * @param color1 The first color to mix.
   * @param color2 The second color to mix.
   * @param amount Ratio of first color to mix.
   * @return Mixture of the two given colors: color1 * amount + color2 * (1 - amount).
   */
  mix(color1: Color, color2: Color, amount: number): Color {
    // TODO: Validate amount.
    return RgbColor.newInstance(
        Math.round(color1.getRed() * amount + color2.getRed() * (1 - amount)),
        Math.round(color1.getGreen() * amount + color2.getGreen() * (1 - amount)),
        Math.round(color1.getBlue() * amount + color2.getBlue() * (1 - amount)));
  },

  neonize(color: Color, ratio: number): Color {
    const targets = [
      RgbColor.newInstance(255, 0, 0),
      RgbColor.newInstance(255, 255, 0),
      RgbColor.newInstance(0, 255, 0),
      RgbColor.newInstance(0, 255, 255),
      RgbColor.newInstance(0, 0, 255),
      RgbColor.newInstance(255, 0, 255),
    ];

    const colorHue = color.getHue();

    let minHueDiff = Number.POSITIVE_INFINITY;
    let selectedTarget = null;
    for (const target of targets) {
      const hueDiff = Math.abs(target.getHue() - colorHue);
      if (hueDiff < minHueDiff) {
        minHueDiff = hueDiff;
        selectedTarget = target;
      }
    }

    if (!selectedTarget) {
      return color;
    }

    return Colors.mix(selectedTarget, color, ratio);
  },
};
