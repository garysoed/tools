import { cache } from '../data/cache';
import { Errors } from '../error';

import { Color } from './color';

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
      throw Errors.assert('red').should('be an integer').butWas(red);
    }

    if (red > 255) {
      throw Errors.assert('red').should('be <= 255').butWas(red);
    }

    if (red < 0) {
      throw Errors.assert('red').should('be positive').butWas(red);
    }

    if (!Number.isInteger(blue)) {
      throw Errors.assert('blue').should('be an integer').butWas(blue);
    }

    if (blue > 255) {
      throw Errors.assert('blue').should('be <= 255').butWas(blue);
    }

    if (blue < 0) {
      throw Errors.assert('blue').should('be positive').butWas(blue);
    }

    if (!Number.isInteger(green)) {
      throw Errors.assert('green').should('be an integer').butWas(green);
    }

    if (green > 255) {
      throw Errors.assert('green').should('be <= 255').butWas(green);
    }

    if (green < 0) {
      throw Errors.assert('green').should('be positive').butWas(green);
    }
  }

  /**
   * {@inheritDoc Color.chroma}
   */
  @cache()
  get chroma(): number {
    return (this.max - this.min) / 255;
  }

  /**
   * {@inheritDoc Color.hue}
   */
  @cache()
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
        h1 = ((blue - red) / chroma / 255) + 2;
        break;
      case blue:
        h1 = ((red - green) / chroma / 255) + 4;
        break;
      default:
        throw new Error(`Should not be able to reach here`);
    }

    return h1 * 60;
  }

  /**
   * {@inheritDoc Color.lightness}
   */
  @cache()
  get lightness(): number {
    return (this.max + this.min) / 2 / 255;
  }

  /**
   * {@inheritDoc Color.saturation}
   */
  @cache()
  get saturation(): number {
    const denominator = (1 - Math.abs(this.lightness * 2 - 1));

    return denominator === 0 ? 0 : this.chroma / denominator;
  }

  @cache()
  private get max(): number {
    return Math.max(this.red, this.green, this.blue);
  }

  @cache()
  private get min(): number {
    return Math.min(this.red, this.green, this.blue);
  }
}
