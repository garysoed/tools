import { Color } from '../interfaces/color';
import { AnyAssert } from '../jasmine/any-assert';


export class ColorAssert extends AnyAssert<Color | null> {
  private readonly colorValue_: Color | null;

  constructor(
      color: Color | null,
      reversed: boolean,
      expect: (actual: any) => jasmine.Matchers<Color | null>) {
    super(color, reversed, expect);
    this.colorValue_ = color;
  }

  /**
   * Checks that the color has the given HSL components.
   * @param hue The expected hue component.
   * @param saturation The expected saturation component.
   * @param lightness The expected lightness component.
   */
  haveHsl(hue: number, saturation: number, lightness: number): void {
    if (this.colorValue_ === null) {
      this.getMatchers_().not.toBeNull();
      return;
    }

    const hslArray = [
      this.colorValue_.getHue(),
      this.colorValue_.getSaturation(),
      this.colorValue_.getLightness(),
    ];

    this.getMatchers_(hslArray).toEqual([hue, saturation, lightness]);
  }

  /**
   * Checks that the color has the given RGB components.
   * @param red The expected red component.
   * @param green The expected green component.
   * @param blue The expected blue component.
   */
  haveRgb(red: number, green: number, blue: number): void {
    if (this.colorValue_ === null) {
      this.getMatchers_().not.toBeNull();
      return;
    }

    const rgbArray = [
      this.colorValue_.getRed(),
      this.colorValue_.getGreen(),
      this.colorValue_.getBlue(),
    ];

    this.getMatchers_(rgbArray).toEqual([red, green, blue]);
  }
}
// TODO: Mutable
