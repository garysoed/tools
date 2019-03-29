import { assert, should } from '@gs-testing/main';
import { HslColor } from './hsl-color';


describe('color.HslColor', () => {
  describe('blue', () => {
    should('return the correct value for blue', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).getBlue()).to.equal(184);
    });
  });

  describe('chroma', () => {
    should('return the correct value for chroma', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).getChroma()).to.beCloseTo(0.23, 2);
    });
  });

  describe('green', () => {
    should('return the correct value for green', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).getGreen()).to.equal(126);
    });
  });

  describe('red', () => {
    should('return the correct value of red', () => {
      assert(HslColor.newInstance(240.5, 0.29, 0.607).getRed()).to.equal(126);
    });
  });

  describe('newInstance', () => {
    should('return the correct color object', () => {
      const hsl = HslColor.newInstance(123, 0.4, 0.5);
      assert(hsl.getHue()).to.equal(123);
      assert(hsl.getSaturation()).to.equal(0.4);
      assert(hsl.getLightness()).to.equal(0.5);
    });

    should('handle hue that are > 360 correctly', () => {
      assert(HslColor.newInstance(456, 0.4, 0.5).getHue()).to.equal(96);
    });

    should('throw error if the saturation is more than 1', () => {
      assert(() => {
        HslColor.newInstance(123, 1.2, 0.4);
      }).to.throwErrorWithMessage(/should be >= 0 and <= 1/);
    });

    should('throw error if the saturation is negative', () => {
      assert(() => {
        HslColor.newInstance(123, -0.2, 0.4);
      }).to.throwErrorWithMessage(/should be >= 0 and <= 1/);
    });

    should('throw error if the lightness is more than 1', () => {
      assert(() => {
        HslColor.newInstance(123, 0.2, 1.4);
      }).to.throwErrorWithMessage(/should be >= 0 and <= 1/);
    });

    should('throw error if the lightness is negative', () => {
      assert(() => {
        HslColor.newInstance(123, 0.2, -0.4);
      }).to.throwErrorWithMessage(/should be >= 0 and <= 1/);
    });
  });
});
