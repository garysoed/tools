import { assert, should } from 'gs-testing';

import { RgbColor } from './rgb-color';


describe('color.RgbColor', () => {
  describe('chroma', () => {
    should('return the correct value of chroma', () => {
      assert(new RgbColor(126, 126, 184).chroma).to.beCloseTo(0.23, 2);
    });
  });

  describe('hue', () => {
    should('return the correct value of hue', () => {
      assert(new RgbColor(126, 126, 184).hue).to.beCloseTo(240, 0);
    });
  });

  describe('lightness', () => {
    should('return the correct value of lightness', () => {
      assert(new RgbColor(126, 126, 184).lightness).to.beCloseTo(0.608, 3);
    });
  });

  describe('saturation', () => {
    should('return the correct value of saturation', () => {
      assert(new RgbColor(126, 126, 184).saturation).to.beCloseTo(0.29, 3);
    });

    should('return 0 if the color is grey', () => {
      assert(new RgbColor(12, 12, 12).saturation).to.equal(0);
    });
  });

  describe('newInstance', () => {
    should('create the correct color object', () => {
      const rgb = new RgbColor(1, 23, 45);
      assert(rgb.red).to.equal(1);
      assert(rgb.green).to.equal(23);
      assert(rgb.blue).to.equal(45);
    });

    should('throw error if red is not an integer', () => {
      assert(() => {
        return new RgbColor(1.23, 23, 45);
      }).to.throwErrorWithMessage(/be an integer/);
    });

    should('throw error if red is negative', () => {
      assert(() => {
        return new RgbColor(-1, 23, 45);
      }).to.throwErrorWithMessage(/be positive/);
    });

    should('throw error if red is > 255', () => {
      assert(() => {
        return new RgbColor(1234, 23, 45);
      }).to.throwErrorWithMessage(/be <= 255/);
    });

    should('throw error if green is not an integer', () => {
      assert(() => {
        return new RgbColor(1, 23.45, 45);
      }).to.throwErrorWithMessage(/be an integer/);

    });

    should('throw error if green is negative', () => {
      assert(() => {
        return new RgbColor(1, -23, 45);
      }).to.throwErrorWithMessage(/be positive/);
    });

    should('throw error if green is > 255', () => {
      assert(() => {
        return new RgbColor(1, 2345, 45);
      }).to.throwErrorWithMessage(/be <= 255/);
    });

    should('throw error if blue is not an integer', () => {
      assert(() => {
        return new RgbColor(1, 23, 4.5);
      }).to.throwErrorWithMessage(/be an integer/);
    });

    should('throw error if blue is negative', () => {
      assert(() => {
        return new RgbColor(1, 23, -45);
      }).to.throwErrorWithMessage(/be positive/);
    });

    should('throw error if blue is > 255', () => {
      assert(() => {
        return new RgbColor(1, 23, 456);
      }).to.throwErrorWithMessage(/be <= 255/);
    });
  });
});
