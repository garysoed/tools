import { Arrays } from '../collection/arrays';
import { cache } from '../data/cache';
import { Color } from '../interfaces/color';


export abstract class BaseColor implements Color {
  /**
   * @override
   */
  abstract getBlue(): number;

  /**
   * @override
   */
  abstract getChroma(): number;

  /**
   * @override
   */
  abstract getGreen(): number;

  /**
   * @override
   */
  abstract getHue(): number;

  /**
   * @override
   */
  abstract getLightness(): number;

  /**
   * @override
   */
  @cache()
  getLuminance(): number {
    const [computedRed, computedGreen, computedBlue] = Arrays
        .of([this.getRed(), this.getGreen(), this.getBlue()])
        .map((value: number) => {
          const normalized = value / 255;
          return normalized <= 0.03928
              ? normalized / 12.92
              : Math.pow((normalized + 0.055) / 1.055, 2.4);
        })
        .asArray();
    return 0.2126 * computedRed + 0.7152 * computedGreen + 0.0722 * computedBlue;
  }

  /**
   * @override
   */
  abstract getRed(): number;

  /**
   * @override
   */
  abstract getSaturation(): number;
}
