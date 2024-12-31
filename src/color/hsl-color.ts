import {CachedValue} from '../data/cached-value';

import {Color} from './color';

type Rgb = readonly [number, number, number];

/**
 * `Color` based on its hue, saturation, and lightness.
 *
 * @thModule color
 */
export class HslColor extends Color {
  readonly hue = this.hueRaw % 360;

  private readonly cachedChroma = new CachedValue(() => {
    return (1 - Math.abs(this.lightness * 2 - 1)) * this.saturation;
  });
  private readonly cachedRgb = new CachedValue<Rgb>(() => {
    const chroma = this.chroma;
    const h1 = this.hue / 60;
    const x = chroma * (1 - Math.abs((h1 % 2) - 1));
    let r1;
    let g1;
    let b1;

    if (h1 < 1) {
      [r1, g1, b1] = [chroma, x, 0];
    } else if (h1 < 2) {
      [r1, g1, b1] = [x, chroma, 0];
    } else if (h1 < 3) {
      [r1, g1, b1] = [0, chroma, x];
    } else if (h1 < 4) {
      [r1, g1, b1] = [0, x, chroma];
    } else if (h1 < 5) {
      [r1, g1, b1] = [x, 0, chroma];
    } else {
      [r1, g1, b1] = [chroma, 0, x];
    }

    const min = this.lightness - chroma / 2;
    return [
      Math.round((r1 + min) * 255),
      Math.round((g1 + min) * 255),
      Math.round((b1 + min) * 255),
    ];
  });

  constructor(
    private readonly hueRaw: number,
    /**
     * {@inheritDoc Color.saturation}
     */
    readonly saturation: number,
    /**
     * {@inheritDoc Color.lightness}
     */
    readonly lightness: number,
  ) {
    super();

    if (lightness > 1 || lightness < 0) {
      throw new Error(`lightness should be >= 0 and <= 1 but was ${lightness}`);
    }

    if (saturation > 1 || saturation < 0) {
      throw new Error(
        `saturation should be >= 0 and <= 1 but was ${saturation}`,
      );
    }
  }

  /**
   * {@inheritDoc Color.blue}
   */
  get blue(): number {
    return this.rgb[2];
  }
  /**
   * {@inheritDoc Color.chroma}
   */
  get chroma(): number {
    return this.cachedChroma.value;
  }
  /**
   * {@inheritDoc Color.green}
   */
  get green(): number {
    return this.rgb[1];
  }
  /**
   * {@inheritDoc Color.red}
   */
  get red(): number {
    return this.rgb[0];
  }

  private get rgb(): Rgb {
    return this.cachedRgb.value;
  }
}
