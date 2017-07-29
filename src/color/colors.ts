import { ArrayOfType, NonNullType } from '../check';
import { HslColor, RgbColor } from '../color';
import { ImmutableList } from '../immutable';
import { Color } from '../interfaces';
import { FloatParser, HexParser, IntegerParser, PercentParser } from '../parse';

const RGB_REGEXP = /^rgb\((.*)\)$/;
const RGBA_REGEXP = /^rgba\((.*)\)$/;
const HSL_REGEXP = /^hsl\((.*)\)$/;
const HSLA_REGEXP = /^hsla\((.*)\)$/;
const HEX_REGEXP = /^#(.{3,8})$/;


export const Colors = {
  /**
   * Creates a color object from the given CSS color string.
   *
   * This ignores the alpha attribute and does not work with named colors.
   * @param cssColor CSS color string.
   * @return The Color object created from the CSS color string, or null if the string is invalid.
   */
  fromCssColor(cssColor: string): Color | null {
    if (RGB_REGEXP.test(cssColor) || RGBA_REGEXP.test(cssColor)) {
      const rgbMatches = RGB_REGEXP.exec(cssColor);
      const rgbaMatches = RGBA_REGEXP.exec(cssColor);
      const matches = rgbMatches === null ? rgbaMatches : rgbMatches;
      if (matches === null) {
        return null;
      }

      const matchString = matches[1];
      let components: (number | null)[];
      if (matchString.indexOf('/') < 0) {
        const list = ImmutableList
            .of(matchString.replace(/ /g, '').split(','))
            .map((match: string, index: number) => {
              return index <= 2 ? IntegerParser.parse(match) : FloatParser.parse(match);
            });
        components = [...list];
      } else {
        const [rgbString] = matchString.split('/');
        const list = ImmutableList
            .of(rgbString.replace(/ +/g, ' ').trim().split(' '))
            .map((match: string) => {
              return IntegerParser.parse(match.trim());
            });
        components = [...list];
      }

      if (!ArrayOfType(NonNullType<number>()).check(components)) {
        return null;
      } else {
        return RgbColor.newInstance(components[0], components[1], components[2]);
      }
    } else if (HSL_REGEXP.test(cssColor) || HSLA_REGEXP.test(cssColor)) {
      const hslMatches = HSL_REGEXP.exec(cssColor);
      const hslaMatches = HSLA_REGEXP.exec(cssColor);
      const matches = hslMatches === null ? hslaMatches : hslMatches;
      if (matches === null) {
        return null;
      }

      const matchString = matches[1];
      let components: (number | null)[];
      if (matchString.indexOf('/') < 0) {
        const list = ImmutableList
            .of(matchString.replace(/ /g, '').split(',').slice(0, 3))
            .map((match: string, index: number) => {
              if (index === 0) {
                const parsed = Number.parseInt(match);
                return Number.isNaN(parsed) ? null : parsed;
              } else {
                return PercentParser.parse(match);
              }
            });
        components = [...list];
      } else {
        const [hslString] = matchString.split('/');
        const list = ImmutableList
            .of(hslString.replace(/ +/g, ' ').trim().split(' '))
            .map((match: string, index: number) => {
              if (index === 0) {
                const parsed = Number.parseInt(match);
                return Number.isNaN(parsed) ? null : parsed;
              } else {
                return PercentParser.parse(match);
              }
            });
        components = [...list];
      }

      if (!ArrayOfType(NonNullType<number>()).check(components)) {
        return null;
      } else {
        return HslColor.newInstance(components[0], components[1], components[2]);
      }
    } else if (HEX_REGEXP.test(cssColor)) {
      const hexMatches = HEX_REGEXP.exec(cssColor);
      if (hexMatches === null) {
        return null;
      }

      const matches = hexMatches[1];
      let components: (number | null)[];
      if (matches.length === 3 || matches.length === 4) {
        const list = ImmutableList
            .of(matches.split(''))
            .map((match: string) => {
              return HexParser.parse(match + match);
            });
        components = [...list];
      } else if (matches.length === 6 || matches.length === 8) {
        const list = ImmutableList
            .of(matches.match(/../g)!)
            .map((match: string) => {
              return HexParser.parse(match);
            });
        components = [...list];
      } else {
        return null;
      }

      if (!ArrayOfType(NonNullType<number>()).check(components)) {
        return null;
      } else {
        return RgbColor.newInstance(components[0], components[1], components[2]);
      }
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
};
// TODO: Mutable
