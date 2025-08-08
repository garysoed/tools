import Colorizr from 'colorizr';

import {cached} from '../data/cached';

export const __COLORIZR_STRING = Symbol('colorizrString');

/**
 * Base class of all colors.
 *
 * @remarks
 * This class provides some simple implementations of some color properties.
 *
 * @thModule color
 */
export class Color {
  readonly [__COLORIZR_STRING]: string;

  private readonly colorizrObject: Colorizr;

  constructor(colorizrString: string) {
    this[__COLORIZR_STRING] = colorizrString;
    this.colorizrObject = new Colorizr(colorizrString);
  }

  toString(): string {
    const value = [this.red, this.green, this.blue]
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('');
    return `#${value}`;
  }

  /**
   * Blue component of the color.
   */
  get blue(): number {
    return this.colorizrObject.blue;
  }
  /**
   * Chroma of the color.
   */
  get chroma(): number {
    return this.colorizrObject.chroma;
  }
  /**
   * Green component of the color.
   */
  get green(): number {
    return this.colorizrObject.green;
  }
  /**
   * Hue component of the color.
   */
  get hue(): number {
    return this.colorizrObject.hue;
  }
  /**
   * Lightness component of the color.
   */
  get lightness(): number {
    return this.colorizrObject.lightness / 100;
  }
  /**
   * Luminance of the color.
   */
  @cached()
  get luminance(): number {
    return this.colorizrObject.luminance;
  }
  /**
   * Red component of the color.
   */
  get red(): number {
    return this.colorizrObject.red;
  }
  /**
   * Saturation component of the color.
   */
  get saturation(): number {
    return this.colorizrObject.saturation / 100;
  }
}
