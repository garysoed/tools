import { Arrays } from '../collection/arrays';
import { Graph } from '../pipeline/graph';
import { Internal } from '../pipeline/internal';
import { Pipe } from '../pipeline/pipe';
import { Validate } from '../valid/validate';

import { IColor } from './interface';


export class HslColor implements IColor {
  private hue_: number;
  private saturation_: number;
  private lightness_: number;

  constructor(hue: number, saturation: number, lightness: number) {
    this.hue_ = hue;
    this.saturation_ = saturation;
    this.lightness_ = lightness;
  }

  @Pipe()
  private pipeChroma_(
      @Internal('getLightness') lightness: number,
      @Internal('getSaturation') saturation: number): number {
    return (1 - Math.abs(2 * lightness - 1)) * saturation;
  }

  @Pipe()
  private pipeLuminance_(
      @Internal('getRed') red: number,
      @Internal('getGreen') green: number,
      @Internal('getBlue') blue: number): number {
    let [computedRed, computedGreen, computedBlue] = Arrays.of([red, green, blue])
        .map((value: number) => {
          let normalized = value / 255;
          return normalized <= 0.03928
              ? normalized / 12.92
              : Math.pow((normalized + 0.055) / 1.055, 2.4);
        })
        .asArray();
    return 0.2126 * computedRed + 0.7152 * computedGreen + 0.0722 * computedBlue;
  }

  @Pipe()
  private pipeRgb_(
      @Internal('getChroma') chroma: number,
      @Internal('getHue') hue: number,
      @Internal('getLightness') lightness: number): [number, number, number] {
    let h1 = hue / 60;
    let x = chroma * (1 - Math.abs((h1 % 2) - 1));
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

    let min = lightness - chroma / 2;
    let [r, g, b] = Arrays.of([r1, g1, b1])
        .map((value: number) => {
          return Math.round((value + min) * 255);
        })
        .asArray();
    return [r, g, b];
  }

  /**
   * @override
   */
  @Pipe()
  getBlue(): number {
    return Graph.run(this, 'pipeRgb_')[2];
  }

  /**
   * @override
   */
  @Pipe()
  getChroma(): number {
    return Graph.run<number>(this, 'pipeChroma_');
  }

  /**
   * @override
   */
  @Pipe()
  getGreen(): number {
    return Graph.run(this, 'pipeRgb_')[1];
  }

  /**
   * @override
   */
  @Pipe()
  getHue(): number {
    return this.hue_;
  }

  /**
   * @override
   */
  @Pipe()
  getLightness(): number {
    return this.lightness_;
  }

  /**
   * @override
   */
  getLuminance(): number {
    return Graph.run<number>(this, 'pipeLuminance_');
  }

  /**
   * @override
   */
  @Pipe()
  getRed(): number {
    return Graph.run(this, 'pipeRgb_')[0];
  }

  /**
   * @override
   */
  @Pipe()
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
    Validate.batch({
      'LIGHTNESS_MAX': Validate.number(lightness).toNot.beGreaterThan(1),
      'LIGHTNESS_MIN': Validate.number(lightness).to.beGreaterThanOrEqualTo(0),
      'SATURATION_MAX': Validate.number(saturation).toNot.beGreaterThan(1),
      'SATURATION_MIN': Validate.number(saturation).to.beGreaterThanOrEqualTo(0),
    }).to.allBeValid().assertValid();
    return new HslColor(hue % 360, saturation, lightness);
  }
}
