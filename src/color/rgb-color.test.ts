import { assert, should } from '@gs-testing/main';
import { RgbColor } from './rgb-color';


describe('color.RgbColor', () => {
  describe('chroma', () => {
    should('return the correct value of chroma', () => {
      assert(RgbColor.newInstance(126, 126, 184).getChroma()).to.beCloseTo(0.23, 2);
    });
  });

  describe('hue', () => {
    should('return the correct value of hue', () => {
      assert(RgbColor.newInstance(126, 126, 184).getHue()).to.beCloseTo(240, 0);
    });
  });

  describe('lightness', () => {
    should('return the correct value of lightness', () => {
      assert(RgbColor.newInstance(126, 126, 184).getLightness()).to.beCloseTo(0.608, 3);
    });
  });

  describe('saturation', () => {
    should('return the correct value of saturation', () => {
      assert(RgbColor.newInstance(126, 126, 184).getSaturation()).to.beCloseTo(0.29, 3);
    });

    should('return 0 if the color is grey', () => {
      assert(RgbColor.newInstance(12, 12, 12).getSaturation()).to.equal(0);
    });
  });

  describe('newInstance', () => {
    should('create the correct color object', () => {
      const rgb = RgbColor.newInstance(1, 23, 45);
      assert(rgb.getRed()).to.equal(1);
      assert(rgb.getGreen()).to.equal(23);
      assert(rgb.getBlue()).to.equal(45);
    });

    should('throw error if red is not an integer', () => {
      assert(() => {
        RgbColor.newInstance(1.23, 23, 45);
      }).to.throwErrorWithMessage(/be an integer/);
    });

    should('throw error if red is negative', () => {
      assert(() => {
        RgbColor.newInstance(-1, 23, 45);
      }).to.throwErrorWithMessage(/be positive/);
    });

    should('throw error if red is > 255', () => {
      assert(() => {
        RgbColor.newInstance(1234, 23, 45);
      }).to.throwErrorWithMessage(/be <= 255/);
    });

    should('throw error if green is not an integer', () => {
      assert(() => {
        RgbColor.newInstance(1, 23.45, 45);
      }).to.throwErrorWithMessage(/be an integer/);

    });

    should('throw error if green is negative', () => {
      assert(() => {
        RgbColor.newInstance(1, -23, 45);
      }).to.throwErrorWithMessage(/be positive/);
    });

    should('throw error if green is > 255', () => {
      assert(() => {
        RgbColor.newInstance(1, 2345, 45);
      }).to.throwErrorWithMessage(/be <= 255/);
    });

    should('throw error if blue is not an integer', () => {
      assert(() => {
        RgbColor.newInstance(1, 23, 4.5);
      }).to.throwErrorWithMessage(/be an integer/);
    });

    should('throw error if blue is negative', () => {
      assert(() => {
        RgbColor.newInstance(1, 23, -45);
      }).to.throwErrorWithMessage(/be positive/);
    });

    should('throw error if blue is > 255', () => {
      assert(() => {
        RgbColor.newInstance(1, 23, 456);
      }).to.throwErrorWithMessage(/be <= 255/);
    });
  });
});
