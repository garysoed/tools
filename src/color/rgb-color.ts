import {Arrays} from '../collection/arrays';
import {Graph} from '../pipeline/graph';
import {Internal} from '../pipeline/internal';
import {Pipe} from '../pipeline/pipe';
import {Validate} from '../valid/validate';

import {IColor} from './interface';


export class RgbColor implements IColor {
  private red_: number;
  private green_: number;
  private blue_: number;

  constructor(red: number, green: number, blue: number) {
    this.red_ = red;
    this.green_ = green;
    this.blue_ = blue;
  }

  @Pipe()
  private pipeChroma_(
      @Internal('pipeMax_') max: number,
      @Internal('pipeMin_') min: number): number {
    return (max - min) / 255;
  }

  @Pipe()
  private pipeHue_(
      @Internal('getChroma') chroma: number,
      @Internal('pipeMax_') max: number,
      @Internal('getRed') red: number,
      @Internal('getGreen') green: number,
      @Internal('getBlue') blue: number): number {
    if (chroma === 0) {
      return 0;
    }

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

  @Pipe()
  private pipeLightness_(
      @Internal('pipeMax_') max: number,
      @Internal('pipeMin_') min: number): number {
    return (max + min) / 2 / 255;
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
  private pipeMax_(
      @Internal('getRed') red: number,
      @Internal('getGreen') green: number,
      @Internal('getBlue') blue: number): number {
    return Math.max(red, green, blue);
  }

  @Pipe()
  private pipeMin_(
      @Internal('getRed') red: number,
      @Internal('getGreen') green: number,
      @Internal('getBlue') blue: number): number {
    return Math.min(red, green, blue);
  }

  @Pipe()
  private pipeSaturation_(
      @Internal('getChroma') chroma: number,
      @Internal('getLightness') lightness: number): number {
    return chroma / (1 - Math.abs(2 * lightness - 1));
  }

  /**
   * @override
   */
  @Pipe()
  getBlue(): number {
    return this.blue_;
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
    return this.green_;
  }

  /**
   * @override
   */
  getHue(): number {
    return Graph.run<number>(this, 'pipeHue_');
  }

  /**
   * @override
   */
  @Pipe()
  getLightness(): number {
    return Graph.run<number>(this, 'pipeLightness_');
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
    return this.red_;
  }

  /**
   * @override
   */
  getSaturation(): number {
    return Graph.run<number>(this, 'pipeSaturation_');
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
