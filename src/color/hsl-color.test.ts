import {assert, should} from 'gs-testing';

import {HslColor} from './hsl-color';

describe('color.HslColor', () => {
  describe('blue', () => {
    should('return the correct value for blue', () => {
      assert(new HslColor(240.5, 0.29, 0.607).blue).to.equal(184);
    });
  });

  describe('chroma', () => {
    should('return the correct value for chroma', () => {
      assert(new HslColor(240.5, 0.29, 0.607).chroma).to.beCloseTo(0.23, 2);
    });
  });

  describe('green', () => {
    should('return the correct value for green', () => {
      assert(new HslColor(240.5, 0.29, 0.607).green).to.equal(126);
    });
  });

  describe('red', () => {
    should('return the correct value of red', () => {
      assert(new HslColor(240.5, 0.29, 0.607).red).to.equal(126);
    });
  });

  describe('newInstance', () => {
    should('return the correct color object', () => {
      const hsl = new HslColor(123, 0.4, 0.5);
      assert(hsl.hue).to.equal(123);
      assert(hsl.saturation).to.equal(0.4);
      assert(hsl.lightness).to.equal(0.5);
    });

    should('handle hue that are > 360 correctly', () => {
      assert(new HslColor(456, 0.4, 0.5).hue).to.equal(96);
    });

    should('throw error if the saturation is more than 1', () => {
      assert(() => {
        return new HslColor(123, 1.2, 0.4);
      }).to.throwErrorWithMessage(/invalid hsl color/);
    });

    should('throw error if the saturation is negative', () => {
      assert(() => {
        return new HslColor(123, -0.2, 0.4);
      }).to.throwErrorWithMessage(/invalid hsl color/);
    });

    should('throw error if the lightness is more than 1', () => {
      assert(() => {
        return new HslColor(123, 0.2, 1.4);
      }).to.throwErrorWithMessage(/invalid hsl color/);
    });

    should('throw error if the lightness is negative', () => {
      assert(() => {
        return new HslColor(123, 0.2, -0.4);
      }).to.throwErrorWithMessage(/invalid hsl color/);
    });
  });
});
