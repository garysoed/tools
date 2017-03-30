import { Validate } from '../valid/validate';

import { BaseColor } from '../color/base-color';
import { cache } from '../data/cache';


export class RgbColor extends BaseColor {
  private readonly red_: number;
  private readonly green_: number;
  private readonly blue_: number;

  constructor(red: number, green: number, blue: number) {
    super();
    this.red_ = red;
    this.green_ = green;
    this.blue_ = blue;
  }

  @cache()
  private getMax_(): number {
    return Math.max(this.getRed(), this.getGreen(), this.getBlue());
  }

  @cache()
  private getMin_(): number {
    return Math.min(this.getRed(), this.getGreen(), this.getBlue());
  }

  /**
   * @override
   */
  getBlue(): number {
    return this.blue_;
  }

  /**
   * @override
   */
  @cache()
  getChroma(): number {
    return (this.getMax_() - this.getMin_()) / 255;
  }

  /**
   * @override
   */
  getGreen(): number {
    return this.green_;
  }

  /**
   * @override
   */
  @cache()
  getHue(): number {
    const chroma = this.getChroma();
    if (chroma === 0) {
      return 0;
    }

    const red = this.getRed();
    const green = this.getGreen();
    const blue = this.getBlue();
    const max = this.getMax_();

    let h1;
    if (max === red) {
      h1 = ((green - blue) / chroma) % 6;
    } else if (max === green) {
      h1 = ((blue - red) / chroma) + 2;
    } else if (max === blue) {
      h1 = ((red - green) / chroma) + 4;
    } else {
      Validate.fail(`Should not be able to reach here`);
    }

    return h1 * 60;
  }

  /**
   * @override
   */
  @cache()
  getLightness(): number {
    return (this.getMax_() + this.getMin_()) / 2 / 255;
  }

  /**
   * @override
   */
  getRed(): number {
    return this.red_;
  }

  /**
   * Creates an instance of the class.
   * @param red The red component of the color.
   * @param green The green component of the color.
   * @param blue The blue component of the color.
   */
  static newInstance(red: number, green: number, blue: number): RgbColor {
    Validate.batch({
      'BLUE_INT': Validate.number(blue).to.beAnInteger(),
      'BLUE_MAX': Validate.number(blue).toNot.beGreaterThan(255),
      'BLUE_MIN': Validate.number(blue).to.beGreaterThanOrEqualTo(0),
      'GREEN_INT': Validate.number(green).to.beAnInteger(),
      'GREEN_MAX': Validate.number(green).toNot.beGreaterThan(255),
      'GREEN_MIN': Validate.number(green).to.beGreaterThanOrEqualTo(0),
      'RED_INT': Validate.number(red).to.beAnInteger(),
      'RED_MAX': Validate.number(red).toNot.beGreaterThan(255),
      'RED_MIN': Validate.number(red).to.beGreaterThanOrEqualTo(0),
    }).to.allBeValid().assertValid();
    return new RgbColor(red, green, blue);
  }
}
