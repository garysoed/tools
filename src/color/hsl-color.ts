import { BaseColor } from '../color/base-color';
import { cache } from '../data';
import { ImmutableList } from '../immutable';

export class HslColor extends BaseColor {
  private readonly hue_: number;
  private readonly lightness_: number;
  private readonly saturation_: number;

  constructor(hue: number, saturation: number, lightness: number) {
    super();
    this.hue_ = hue;
    this.saturation_ = saturation;
    this.lightness_ = lightness;
  }

  /**
   * @override
   */
  @cache()
  getBlue(): number {
    return this.getRgb_()[2];
  }

  /**
   * @override
   */
  @cache()
  getChroma(): number {
    return (1 - Math.abs(2 * this.getLightness() - 1)) * this.getSaturation();
  }

  /**
   * @override
   */
  @cache()
  getGreen(): number {
    return this.getRgb_()[1];
  }

  /**
   * @override
   */
  getHue(): number {
    return this.hue_;
  }

  /**
   * @override
   */
  getLightness(): number {
    return this.lightness_;
  }

  /**
   * @override
   */
  getRed(): number {
    return this.getRgb_()[0];
  }

  @cache()
  private getRgb_(): [number, number, number] {
    const chroma = this.getChroma();
    const h1 = this.getHue() / 60;
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

    const min = this.getLightness() - chroma / 2;
    const components = ImmutableList.of([r1, g1, b1])
        .map((value: number) => {
          return Math.round((value + min) * 255);
        });
    const [r, g, b] = [...components];
    return [r, g, b];
  }

  /**
   * @override
   */
  getSaturation(): number {
    return this.saturation_;
  }

  /**
   * Creates an instance of the class.
   * @param hue The hue component of the color.
   * @param saturation The saturation component of the color.
   * @param lightness The lightness component of the color.
   */
  static newInstance(hue: number, saturation: number, lightness: number): HslColor {
    if (lightness > 1 || lightness < 0) {
      throw new Error(`${lightness} should be >= 0 and <= 1`);
    }

    if (saturation > 1 || saturation < 0) {
      throw new Error(`${saturation} should be >= 0 and <= 1`);
    }
    return new HslColor(hue % 360, saturation, lightness);
  }
}
// TODO: Mutable
