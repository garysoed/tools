import {TestBase} from '../test-base';
TestBase.setup();

import {HslColor} from './hsl-color';


describe('color.HslColor', () => {
  describe('blue', () => {
    it('should return the correct value for blue', () => {
      expect(HslColor.newInstance(240.5, 0.29, 0.607).blue).toEqual(184);
    });
  });

  describe('chroma', () => {
    it('should return the correct value for chroma', () => {
      expect(HslColor.newInstance(240.5, 0.29, 0.607).chroma).toBeCloseTo(0.23, 2);
    });
  });

  describe('green', () => {
    it('should return the correct value for green', () => {
      expect(HslColor.newInstance(240.5, 0.29, 0.607).green).toEqual(126);
    });
  });

  describe('luminance', () => {
    it('should return the correct value of luminance', () => {
      expect(HslColor.newInstance(240.5, 0.29, 0.607).luminance).toBeCloseTo(0.23, 2);
    });
  });

  describe('red', () => {
    it('should return the correct value of red', () => {
      expect(HslColor.newInstance(240.5, 0.29, 0.607).red).toEqual(126);
    });
  });

  describe('newInstance', () => {
    it('should return the correct color object', () => {
      let color = HslColor.newInstance(123, 0.4, 0.5);
      expect(color.hue).toEqual(123);
      expect(color.saturation).toEqual(0.4);
      expect(color.lightness).toEqual(0.5);
    });

    it('should handle hue that are > 360 correctly', () => {
      let color = HslColor.newInstance(456, 0.4, 0.5);
      expect(color.hue).toEqual(96);
    });

    it('should throw error if the saturation is more than 1', () => {
      expect(() => {
        HslColor.newInstance(123, 1.2, 0.4);
      }).toThrowError(/SATURATION_MAX/);
    });

    it('should throw error if the saturation is negative', () => {
      expect(() => {
        HslColor.newInstance(123, -0.2, 0.4);
      }).toThrowError(/SATURATION_MIN/);
    });

    it('should throw error if the lightness is more than 1', () => {
      expect(() => {
        HslColor.newInstance(123, 0.2, 1.4);
      }).toThrowError(/LIGHTNESS_MAX/);
    });

    it('should throw error if the lightness is negative', () => {
      expect(() => {
        HslColor.newInstance(123, 0.2, -0.4);
      }).toThrowError(/LIGHTNESS_MIN/);
    });
  });
});
