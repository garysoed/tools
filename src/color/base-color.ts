import { cache } from '../data/cache';
import { Color } from './color';

export abstract class BaseColor implements Color {
  abstract getBlue(): number;

  abstract getChroma(): number;

  abstract getGreen(): number;

  abstract getHue(): number;

  abstract getLightness(): number;

  @cache()
  getLuminance(): number {
    const [computedRed, computedGreen, computedBlue] = [
          this.getRed(),
          this.getGreen(),
          this.getBlue(),
        ]
        .map((value: number) => {
          const normalized = value / 255;

          return normalized <= 0.03928
              ? normalized / 12.92
              : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });

    return computedRed * 0.2126 + computedGreen * 0.7152 + computedBlue * 0.0722;
  }

  abstract getRed(): number;

  abstract getSaturation(): number;
}
