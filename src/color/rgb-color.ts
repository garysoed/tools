import { BaseColor } from '../color/base-color';
import { cache } from '../data/cache';


export class RgbColor extends BaseColor {
  private readonly blue_: number;
  private readonly green_: number;
  private readonly red_: number;

  constructor(red: number, green: number, blue: number) {
    super();
    this.red_ = red;
    this.green_ = green;
    this.blue_ = blue;
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
      throw new Error(`Should not be able to reach here`);
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
  getRed(): number {
    return this.red_;
  }

  /**
   * @override
   */
  @cache()
  getSaturation(): number {
    const denominator = (1 - Math.abs(2 * this.getLightness() - 1));
    return denominator === 0 ? 0 : this.getChroma() / denominator;
  }

  /**
   * Creates an instance of the class.
   * @param red The red component of the color.
   * @param green The green component of the color.
   * @param blue The blue component of the color.
   */
  static newInstance(red: number, green: number, blue: number): RgbColor {
    if (!Number.isInteger(red)) {
      throw new Error(`${red} is expected to be an integer`);
    }

    if (red > 255) {
      throw new Error(`${red} should be <= 255`);
    }

    if (red < 0) {
      throw new Error(`${red} should be positive`);
    }

    if (!Number.isInteger(blue)) {
      throw new Error(`${blue} is expected to be an integer`);
    }

    if (blue > 255) {
      throw new Error(`${blue} should be <= 255`);
    }

    if (blue < 0) {
      throw new Error(`${blue} should be positive`);
    }

    if (!Number.isInteger(green)) {
      throw new Error(`${green} is expected to be an integer`);
    }

    if (green > 255) {
      throw new Error(`${green} should be <= 255`);
    }

    if (green < 0) {
      throw new Error(`${green} should be positive`);
    }
    return new RgbColor(red, green, blue);
  }
}
// TODO: Mutable
