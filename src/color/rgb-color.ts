import {cached} from '../data/cached';

import {Color} from './color';

/**
 * `Color` based on its red, green, and blue components.
 *
 * @thModule color
 */
export class RgbColor extends Color {
  constructor(
    /**
     * {@inheritDoc Color.red}
     */
    readonly red: number,
    /**
     * {@inheritDoc Color.green}
     */
    readonly green: number,
    /**
     * {@inheritDoc Color.blue}
     */
    readonly blue: number,
  ) {
    super();

    if (!Number.isInteger(red)) {
      throw new Error(`red should be an integer but was ${red}`);
    }

    if (red > 255) {
      throw new Error(`red should be <= 255 but was ${red}`);
    }

    if (red < 0) {
      throw new Error(`red should be positive but was ${red}`);
    }

    if (!Number.isInteger(blue)) {
      throw new Error(`blue should be an integer but was ${blue}`);
    }

    if (blue > 255) {
      throw new Error(`blue should be <= 255 but was ${blue}`);
    }

    if (blue < 0) {
      throw new Error(`blue should be positive but was ${blue}`);
    }

    if (!Number.isInteger(green)) {
      throw new Error(`green should be an integer but was ${green}`);
    }

    if (green > 255) {
      throw new Error(`green should be <= 255 but was ${green}`);
    }

    if (green < 0) {
      throw new Error(`green should be positive but was ${green}`);
    }
  }

  /**
   * {@inheritDoc Color.chroma}
   */
  @cached()
  get chroma(): number {
    return (this.max - this.min) / 255;
  }

  /**
   * {@inheritDoc Color.hue}
   */
  @cached()
  get hue(): number {
    const chroma = this.chroma;
    if (chroma === 0) {
      return 0;
    }

    const red = this.red;
    const green = this.green;
    const blue = this.blue;
    const max = this.max;

    let h1;
    switch (max) {
      case red:
        h1 = ((green - blue) / chroma / 255) % 6;
        break;
      case green:
        h1 = (blue - red) / chroma / 255 + 2;
        break;
      case blue:
        h1 = (red - green) / chroma / 255 + 4;
        break;
      default:
        throw new Error('Should not be able to reach here');
    }

    return h1 * 60;
  }

  /**
   * {@inheritDoc Color.lightness}
   */
  @cached()
  get lightness(): number {
    return (this.max + this.min) / 2 / 255;
  }

  /**
   * {@inheritDoc Color.saturation}
   */
  @cached()
  get saturation(): number {
    const denominator = 1 - Math.abs(this.lightness * 2 - 1);

    return denominator === 0 ? 0 : this.chroma / denominator;
  }

  @cached()
  private get max(): number {
    return Math.max(this.red, this.green, this.blue);
  }

  @cached()
  private get min(): number {
    return Math.min(this.red, this.green, this.blue);
  }
}
