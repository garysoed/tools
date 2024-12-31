import {cached} from '../data/cached';
import {CachedValue} from '../data/cached-value';

/**
 * Base class of all colors.
 *
 * @remarks
 * This class provides some simple implementations of some color properties.
 *
 * @thModule color
 */
export abstract class Color {
  private readonly cachedLuminance = new CachedValue(() => {});

  /**
   * Blue component of the color.
   */
  abstract get blue(): number;
  /**
   * Chroma of the color.
   */
  abstract get chroma(): number;
  /**
   * Green component of the color.
   */
  abstract get green(): number;
  /**
   * Hue component of the color.
   */
  abstract get hue(): number;
  /**
   * Lightness component of the color.
   */
  abstract get lightness(): number;
  /**
   * Luminance of the color.
   */
  @cached()
  get luminance(): number {
    const computedRed = computeLuminanceComponent(this.red);
    const computedGreen = computeLuminanceComponent(this.green);
    const computedBlue = computeLuminanceComponent(this.blue);

    return (
      computedRed * 0.2126 + computedGreen * 0.7152 + computedBlue * 0.0722
    );
  }
  /**
   * Red component of the color.
   */
  abstract get red(): number;
  /**
   * Saturation component of the color.
   */
  abstract get saturation(): number;
}

function computeLuminanceComponent(value: number): number {
  const normalized = value / 255;

  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}
