import { BaseColor } from 'src/color/base-color';
import { RgbColor } from 'src/color/rgb-color';

export const Colors = {
  /**
   * @param foreground Foreground color.
   * @param background Background color.
   * @return The contrast ratio.
   */
  getContrast(foreground: BaseColor, background: BaseColor): number {
    const fgLuminance = foreground.getLuminance();
    const bgLuminance = background.getLuminance();
    return (Math.max(fgLuminance, bgLuminance) + 0.05)
        / (Math.min(fgLuminance, bgLuminance) + 0.05);
  },

  /**
   * @param color1 The first color to mix.
   * @param color2 The second color to mix.
   * @param amount Ratio of first color to mix.
   * @return Mixture of the two given colors: color1 * amount + color2 * (1 - amount).
   */
  mix(color1: BaseColor, color2: BaseColor, amount: number): BaseColor {
    // TODO: Validate amount.
    return RgbColor.newInstance(
        Math.round(color1.getRed() * amount + color2.getRed() * (1 - amount)),
        Math.round(color1.getGreen() * amount + color2.getGreen() * (1 - amount)),
        Math.round(color1.getBlue() * amount + color2.getBlue() * (1 - amount)));
  },
};
