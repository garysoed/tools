import {assert, TestBase} from '../test-base';
TestBase.setup();

import {HslColor} from './hsl-color';


describe('color.HslColor', () => {
  describe('blue', () => {
    it('should return the correct value for blue', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).blue).to.equal(184);
    });
  });

  describe('chroma', () => {
    it('should return the correct value for chroma', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).chroma).to.beCloseTo(0.23, 2);
    });
  });

  describe('green', () => {
    it('should return the correct value for green', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).green).to.equal(126);
    });
  });

  describe('luminance', () => {
    it('should return the correct value of luminance', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).luminance).to.beCloseTo(0.23, 2);
    });
  });

  describe('red', () => {
    it('should return the correct value of red', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).red).to.equal(126);
    });
  });

  describe('newInstance', () => {
    it('should return the correct color object', () => {
      let color = HslColor.newInstance(123, 0.4, 0.5);
      assert(color.hue).to.equal(123);
      assert(color.saturation).to.equal(0.4);
      assert(color.lightness).to.equal(0.5);
    });

    it('should handle hue that are > 360 correctly', () => {
      let color = HslColor.newInstance(456, 0.4, 0.5);
      assert(color.hue).to.equal(96);
    });

    it('should throw error if the saturation is more than 1', () => {
      assert(() => {
        HslColor.newInstance(123, 1.2, 0.4);
      }).to.throwError(/SATURATION_MAX/);
    });

    it('should throw error if the saturation is negative', () => {
      assert(() => {
        HslColor.newInstance(123, -0.2, 0.4);
      }).to.throwError(/SATURATION_MIN/);
    });

    it('should throw error if the lightness is more than 1', () => {
      assert(() => {
        HslColor.newInstance(123, 0.2, 1.4);
      }).to.throwError(/LIGHTNESS_MAX/);
    });

    it('should throw error if the lightness is negative', () => {
      assert(() => {
        HslColor.newInstance(123, 0.2, -0.4);
      }).to.throwError(/LIGHTNESS_MIN/);
    });
  });
});
