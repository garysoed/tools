import { assert, assertColor, TestBase } from '../test-base';
TestBase.setup();

import { Colors } from '../color/colors';
import { RgbColor } from '../color/rgb-color';


describe('namespace.Colors ', () => {
  describe('fromCssColor', () => {
    it('should handle legacy style RGB', () => {
      assertColor(Colors.fromCssColor('rgb(12,34,56)')).to.haveRgb(12, 34, 56);
    });

    it('should handle legacy style RGB with white spaces', () => {
      assertColor(Colors.fromCssColor('rgb(12,   34, 56  )')).to.haveRgb(12, 34, 56);
    });

    it('should return null for RGB if one of the components is not a number', () => {
      assertColor(Colors.fromCssColor('rgb(12, ab, 56')).to.beNull();
    });

    it('should handle legacy style RGBA', () => {
      assertColor(Colors.fromCssColor('rgba(12,34,56,.78)')).to.haveRgb(12, 34, 56);
    });

    it('should handle legacy style RGBA with white spaces', () => {
      assertColor(Colors.fromCssColor('rgba(  12,   34, 56,   .78  )')).to.haveRgb(12, 34, 56);
    });

    it('should handle legacy style RGBA if one of the RGB components is not an integer', () => {
      assertColor(Colors.fromCssColor('rgba(12, 3.6, 56, .78)')).to.haveRgb(12, 4, 56);
    });

    it('should handle functional RGB', () => {
      assertColor(Colors.fromCssColor('rgb(12 34 56/0.78)')).to.haveRgb(12, 34, 56);
    });

    it('should handle functional RGB with white spaces', () => {
      assertColor(Colors.fromCssColor('rgb(12    34  56  /   0.78)')).to.haveRgb(12, 34, 56);
    });

    it('should return null for RGB if one of the components is not an integer', () => {
      assertColor(Colors.fromCssColor('rgb(12  34,  56 / 0.78')).to.beNull();
    });

    it('should handle functional RGBA', () => {
      assertColor(Colors.fromCssColor('rgba(12 34 56/.78)')).to.haveRgb(12, 34, 56);
    });

    it('should handle legacy style RGBA with white spaces', () => {
      assertColor(Colors.fromCssColor('rgba(12   34  56   / .78  )')).to.haveRgb(12, 34, 56);
    });

    it('should handle legacy style RGBA if one of the RGB components is not an integer', () => {
      assertColor(Colors.fromCssColor('rgba(12 3.6 56 / .78)')).to.haveRgb(12, 4, 56);
    });

    it('should handle legacy style HSL', () => {
      assertColor(Colors.fromCssColor('hsl(12,34%,56%)')).to.haveHsl(12, .34, .56);
    });

    it('should handle legacy style HSL with white spaces', () => {
      assertColor(Colors.fromCssColor('hsl(12,   34  %, 56  % )')).to.haveHsl(12, .34, .56);
    });

    it('should return null for HSL if the saturation is not a percent', () => {
      assertColor(Colors.fromCssColor('hsl(12, 34, 56%')).to.beNull();
    });

    it('should handle legacy style HSLA', () => {
      assertColor(Colors.fromCssColor('hsla(12,34%,56%,.78)')).to.haveHsl(12, .34, .56);
    });

    it('should handle legacy style HSLA with white spaces', () => {
      assertColor(Colors.fromCssColor('hsla(  12,  34 %, 56  %,  .78  )')).to.haveHsl(12, .34, .56);
    });

    it('should return null if the saturation is not a percent', () => {
      assertColor(Colors.fromCssColor('hsla(12, 36, 56%, .78)')).to.beNull();
    });

    it('should handle functional HSL', () => {
      assertColor(Colors.fromCssColor('hsl(12 34% 56%/0.78)')).to.haveHsl(12, .34, .56);
    });

    it('should handle functional HSL with white spaces', () => {
      assertColor(Colors.fromCssColor('hsl(12    34%  56%  /   0.78)')).to.haveHsl(12, .34, .56);
    });

    it('should return null for HSL if the saturation is not a percent', () => {
      assertColor(Colors.fromCssColor('hsl(12  34  56% / 0.78')).to.beNull();
    });

    it('should handle functional HSLA', () => {
      assertColor(Colors.fromCssColor('hsla(12 34% 56%/.78)')).to.haveHsl(12, .34, .56);
    });

    it('should handle legacy style HSLA with white spaces', () => {
      assertColor(Colors.fromCssColor('hsla(12   34%  56%   / .78  )')).to.haveHsl(12, .34, .56);
    });

    it('should return null if the saturation is not a percent', () => {
      assertColor(Colors.fromCssColor('hsla(12 34 56% / .78)')).to.beNull();
    });

    it('should handle hex strings', () => {
      assertColor(Colors.fromCssColor('#abcdef')).to.haveRgb(0xab, 0xcd, 0xef);
    });

    it('should return null if one of the hex chars is invalid hex', () => {
      assertColor(Colors.fromCssColor('#gacdef')).to.beNull();
    });

    it('should handle short hex strings', () => {
      assertColor(Colors.fromCssColor('#abc')).to.haveRgb(0xaa, 0xbb, 0xcc);
    });

    it('should return null if one of the hex chars is invalid hex', () => {
      assertColor(Colors.fromCssColor('#abg')).to.beNull();
    });

    it('should handle hex strings with alpha', () => {
      assertColor(Colors.fromCssColor('#abcdef12')).to.haveRgb(0xab, 0xcd, 0xef);
    });

    it('should return null if one of the hex chars is invalid hex', () => {
      assertColor(Colors.fromCssColor('#abcdefgh')).to.beNull();
    });

    it('should handle short hex strings with alpha', () => {
      assertColor(Colors.fromCssColor('#abcd')).to.haveRgb(0xaa, 0xbb, 0xcc);
    });

    it('should return null if one of the hex chars is invalid hex', () => {
      assertColor(Colors.fromCssColor('#defg')).to.beNull();
    });

    it('should return null if there are invalid number of hex chars', () => {
      assertColor(Colors.fromCssColor('#abcde')).to.beNull();
    });

    it('should return null if format is invalid', () => {
      assertColor(Colors.fromCssColor('yellow')).to.beNull();
    });
  });

  describe('getContrast', () => {
    it('should return the correct contrast ratio', () => {
      const foreground = RgbColor.newInstance(0x12, 0x34, 0x56);
      const background = RgbColor.newInstance(0x78, 0x9a, 0xbc);
      assert(Colors.getContrast(foreground, background)).to.beCloseTo(4.3, 0.01);
    });
  });

  describe('mix', () => {
    it('should return the correct color', () => {
      const color1 = RgbColor.newInstance(0x12, 0x34, 0x56);
      const color2 = RgbColor.newInstance(0x78, 0x9a, 0xbc);
      const mix = Colors.mix(color1, color2, 0.75);
      assertColor(mix).to.haveRgb(44, 78, 112);
    });
  });
});
