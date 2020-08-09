import { assert, should, test } from 'gs-testing';

import { Color } from './color';
import { fromCssColor, getContrast, mix } from './colors';
import { RgbColor } from './rgb-color';

function getRgb(color: Color): [number, number, number] {
  return [
    color.red,
    color.green,
    color.blue,
  ];
}

function getHsl(color: Color): [number, number, number] {
  return [
    color.hue,
    color.saturation,
    color.lightness,
  ];
}


test('@tools/color/colors ', () => {
  test('fromCssColor', () => {
    should('handle legacy style RGB', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgb(12,34,56)')!)).to.haveExactElements([12, 34, 56]);
    });

    should('handle legacy style RGB with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgb(12,   34, 56  )')!)).to
          .haveExactElements([12, 34, 56]);
    });

    should('return null for RGB if one of the components is not a number', () => {
      assert(fromCssColor('rgb(12, ab, 56')).to.beNull();
    });

    should('handle legacy style RGBA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgba(12,34,56,.78)')!)).to.haveExactElements([12, 34, 56]);
    });

    should('handle legacy style RGBA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgba(  12,   34, 56,   .78  )')!)).to
          .haveExactElements([12, 34, 56]);
    });

    should('handle legacy style RGBA if one of the RGB components is not an integer', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgba(12, 3.6, 56, .78)')!)).to
          .haveExactElements([12, 4, 56]);
    });

    should('handle functional RGB', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgb(12 34 56/0.78)')!)).to.haveExactElements([12, 34, 56]);
    });

    should('handle functional RGB with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgb(12    34  56  /   0.78)')!)).to
          .haveExactElements([12, 34, 56]);
    });

    should('return null for RGB if one of the components is not an integer', () => {
      assert(fromCssColor('rgb(12  34,  56 / 0.78')).to.beNull();
    });

    should('handle functional RGBA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgba(12 34 56/.78)')!)).to.haveExactElements([12, 34, 56]);
    });

    should('handle legacy style RGBA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgba(12   34  56   / .78  )')!)).to
          .haveExactElements([12, 34, 56]);
    });

    should('handle legacy style RGBA if one of the RGB components is not an integer', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('rgba(12 3.6 56 / .78)')!)).to
          .haveExactElements([12, 4, 56]);
    });

    should('handle legacy style HSL', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsl(12,34%,56%)')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('handle legacy style HSL with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsl(12,   34  %, 56  % )')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('return null for HSL if the saturation is not a percent', () => {
      assert(fromCssColor('hsl(12, 34, 56%')).to.beNull();
    });

    should('handle legacy style HSLA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsla(12,34%,56%,.78)')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('handle legacy style HSLA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsla(  12,  34 %, 56  %,  .78  )')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('return null if the saturation is not a percent', () => {
      assert(fromCssColor('hsla(12, 36, 56%, .78)')).to.beNull();
    });

    should('handle functional HSL', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsl(12 34% 56%/0.78)')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('handle functional HSL with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsl(12    34%  56%  /   0.78)')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('return null for HSL if the saturation is not a percent', () => {
      assert(fromCssColor('hsl(12  34  56% / 0.78')).to.beNull();
    });

    should('handle functional HSLA', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsla(12 34% 56%/.78)')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('handle legacy style HSLA with white spaces', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getHsl(fromCssColor('hsla(12   34%  56%   / .78  )')!)).to
          .haveExactElements([12, 0.34, 0.56]);
    });

    should('return null if the saturation is not a percent', () => {
      assert(fromCssColor('hsla(12 34 56% / .78)')).to.beNull();
    });

    should('handle hex strings', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('#abcdef')!)).to.haveExactElements([0xAB, 0xCD, 0xEF]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(fromCssColor('#gacdef')).to.beNull();
    });

    should('handle short hex strings', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('#abc')!)).to.haveExactElements([0xAA, 0xBB, 0xCC]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(fromCssColor('#abg')).to.beNull();
    });

    should('handle hex strings with alpha', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('#abcdef12')!)).to.haveExactElements([0xAB, 0xCD, 0xEF]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(fromCssColor('#abcdefgh')).to.beNull();
    });

    should('handle short hex strings with alpha', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getRgb(fromCssColor('#abcd')!)).to.haveExactElements([0xAA, 0xBB, 0xCC]);
    });

    should('return null if one of the hex chars is invalid hex', () => {
      assert(fromCssColor('#defg')).to.beNull();
    });

    should('return null if there are invalid number of hex chars', () => {
      assert(fromCssColor('#abcde')).to.beNull();
    });

    should('return null if format is invalid', () => {
      assert(fromCssColor('yellow')).to.beNull();
    });
  });

  test('getContrast', () => {
    should('return the correct contrast ratio', () => {
      const foreground = new RgbColor(0x12, 0x34, 0x56);
      const background = new RgbColor(0x78, 0x9A, 0xBC);
      assert(getContrast(foreground, background)).to.beCloseTo(4.3, 0.01);
    });
  });

  test('mix', () => {
    should('return the correct color', () => {
      const color1 = new RgbColor(0x12, 0x34, 0x56);
      const color2 = new RgbColor(0x78, 0x9A, 0xBC);
      const mixedColor = mix(color1, color2, 0.75);
      assert(getRgb(mixedColor)).to.haveExactElements([44, 78, 112]);
    });
  });
});
