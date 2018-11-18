import { assert } from 'gs-testing/export/main';
import { Color } from './color';
import { Colors } from './colors';
import { RgbColor } from './rgb-color';

function getRgb(color: Color): [number, number, number] {
  return [
    color.getRed(),
    color.getGreen(),
    color.getBlue(),
  ];
}

function getHsl(color: Color): [number, number, number] {
  return [
    color.getHue(),
    color.getSaturation(),
    color.getLightness(),
  ];
}

describe('namespace.Colors ', () => {
  describe('fromCssColor', () => {
    should('handle legacy style RGB', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgb(12,34,56)')!)).to.equal([12, 34, 56]);
    });

    should('handle legacy style RGB with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgb(12,   34, 56  )')!)).to.equal([12, 34, 56]);
    });

    should('return null for RGB if one of the components is not a number', () => {
      assert(Colors.fromCssColor('rgb(12, ab, 56')).to.beNull();
    });

    should('handle legacy style RGBA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgba(12,34,56,.78)')!)).to.equal([12, 34, 56]);
    });

    should('handle legacy style RGBA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgba(  12,   34, 56,   .78  )')!)).to.equal([12, 34, 56]);
    });

    should('handle legacy style RGBA if one of the RGB components is not an integer', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgba(12, 3.6, 56, .78)')!)).to.equal([12, 4, 56]);
    });

    should('handle functional RGB', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgb(12 34 56/0.78)')!)).to.equal([12, 34, 56]);
    });

    should('handle functional RGB with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgb(12    34  56  /   0.78)')!)).to.equal([12, 34, 56]);
    });

    should('return null for RGB if one of the components is not an integer', () => {
      assert(Colors.fromCssColor('rgb(12  34,  56 / 0.78')).to.beNull();
    });

    should('handle functional RGBA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgba(12 34 56/.78)')!)).to.equal([12, 34, 56]);
    });

    should('handle legacy style RGBA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgba(12   34  56   / .78  )')!)).to.equal([12, 34, 56]);
    });

    should('handle legacy style RGBA if one of the RGB components is not an integer', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('rgba(12 3.6 56 / .78)')!)).to.equal([12, 4, 56]);
    });

    should('handle legacy style HSL', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsl(12,34%,56%)')!)).to.equal([12, 0.34, 0.56]);
    });

    should('handle legacy style HSL with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsl(12,   34  %, 56  % )')!)).to.equal([12, 0.34, 0.56]);
    });

    should('return null for HSL if the saturation is not a percent', () => {
      assert(Colors.fromCssColor('hsl(12, 34, 56%')).to.beNull();
    });

    should('handle legacy style HSLA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsla(12,34%,56%,.78)')!)).to.equal([12, 0.34, 0.56]);
    });

    should('handle legacy style HSLA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsla(  12,  34 %, 56  %,  .78  )')!)).to
          .equal([12, 0.34, 0.56]);
    });

    should('return null if the saturation is not a percent', () => {
      assert(Colors.fromCssColor('hsla(12, 36, 56%, .78)')).to.beNull();
    });

    should('handle functional HSL', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsl(12 34% 56%/0.78)')!)).to.equal([12, 0.34, 0.56]);
    });

    should('handle functional HSL with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsl(12    34%  56%  /   0.78)')!)).to
          .equal([12, 0.34, 0.56]);
    });

    should('return null for HSL if the saturation is not a percent', () => {
      assert(Colors.fromCssColor('hsl(12  34  56% / 0.78')).to.beNull();
    });

    should('handle functional HSLA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsla(12 34% 56%/.78)')!)).to
          .equal([12, 0.34, 0.56]);
    });

    should('handle legacy style HSLA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(Colors.fromCssColor('hsla(12   34%  56%   / .78  )')!)).to
          .equal([12, 0.34, 0.56]);
    });

    should('return null if the saturation is not a percent', () => {
      assert(Colors.fromCssColor('hsla(12 34 56% / .78)')).to.beNull();
    });

    should('handle hex strings', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('#abcdef')!)).to.equal([0xAB, 0xCD, 0xEF]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(Colors.fromCssColor('#gacdef')).to.beNull();
    });

    should('handle short hex strings', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('#abc')!)).to.equal([0xAA, 0xBB, 0xCC]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(Colors.fromCssColor('#abg')).to.beNull();
    });

    should('handle hex strings with alpha', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('#abcdef12')!)).to.equal([0xAB, 0xCD, 0xEF]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(Colors.fromCssColor('#abcdefgh')).to.beNull();
    });

    should('handle short hex strings with alpha', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(Colors.fromCssColor('#abcd')!)).to.equal([0xAA, 0xBB, 0xCC]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(Colors.fromCssColor('#defg')).to.beNull();
    });

    should('return null if there are invalid number of hex chars', () => {
      assert(Colors.fromCssColor('#abcde')).to.beNull();
    });

    should('return null if format is invalid', () => {
      assert(Colors.fromCssColor('yellow')).to.beNull();
    });
  });

  describe('getContrast', () => {
    should('return the correct contrast ratio', () => {
      const foreground = RgbColor.newInstance(0x12, 0x34, 0x56);
      const background = RgbColor.newInstance(0x78, 0x9A, 0xBC);
      assert(Colors.getContrast(foreground, background)).to.beCloseTo(4.3, 0.01);
    });
  });

  describe('mix', () => {
    should('return the correct color', () => {
      const color1 = RgbColor.newInstance(0x12, 0x34, 0x56);
      const color2 = RgbColor.newInstance(0x78, 0x9A, 0xBC);
      const mix = Colors.mix(color1, color2, 0.75);
      assert(getRgb(mix)).to.equal([44, 78, 112]);
    });
  });
});
