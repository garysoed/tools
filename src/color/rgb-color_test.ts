import {assert, TestBase} from '../test-base';
TestBase.setup();

import {RgbColor} from './rgb-color';


describe('color.RgbColor', () => {
  describe('chroma', () => {
    it('should return the correct value of chroma', () => {
      assert(RgbColor.newInstance(126, 126, 184).chroma).to.beCloseTo(0.23, 2);
    });
  });

  describe('hue', () => {
    it('should return the correct value of hue', () => {
      assert(RgbColor.newInstance(126, 126, 184).hue).to.beCloseTo(240, 0);
    });
  });

  describe('lightness', () => {
    it('should return the correct value of lightness', () => {
      assert(RgbColor.newInstance(126, 126, 184).lightness).to.beCloseTo(0.608, 3);
    });
  });

  describe('luminance', () => {
    it('should return the correct value of luminance', () => {
      assert(RgbColor.newInstance(126, 126, 184).luminance).to.beCloseTo(0.23, 2);
    });
  });

  describe('saturation', () => {
    it('should return the correct value of saturation', () => {
      assert(RgbColor.newInstance(126, 126, 184).saturation).to.beCloseTo(0.290, 3);
    });
  });

  describe('newInstance', () => {
    it('should create the correct color object', () => {
      let color = RgbColor.newInstance(1, 23, 45);
      assert(color.red).to.equal(1);
      assert(color.green).to.equal(23);
      assert(color.blue).to.equal(45);
    });

    it('should throw error if red is not an integer', () => {
      assert(() => {
        RgbColor.newInstance(1.23, 23, 45);
      }).to.throwError(/RED_INT/);
    });

    it('should throw error if red is negative', () => {
      assert(() => {
        RgbColor.newInstance(-1, 23, 45);
      }).to.throwError(/RED_MIN/);
    });

    it('should throw error if red is > 255', () => {
      assert(() => {
        RgbColor.newInstance(1234, 23, 45);
      }).to.throwError(/RED_MAX/);
    });

    it('should throw error if green is not an integer', () => {
      assert(() => {
        RgbColor.newInstance(1, 23.45, 45);
      }).to.throwError(/GREEN_INT/);

    });

    it('should throw error if green is negative', () => {
      assert(() => {
        RgbColor.newInstance(1, -23, 45);
      }).to.throwError(/GREEN_MIN/);
    });

    it('should throw error if green is > 255', () => {
      assert(() => {
        RgbColor.newInstance(1, 2345, 45);
      }).to.throwError(/GREEN_MAX/);
    });

    it('should throw error if blue is not an integer', () => {
      assert(() => {
        RgbColor.newInstance(1, 23, 4.5);
      }).to.throwError(/BLUE_INT/);
    });

    it('should throw error if blue is negative', () => {
      assert(() => {
        RgbColor.newInstance(1, 23, -45);
      }).to.throwError(/BLUE_MIN/);
    });

    it('should throw error if blue is > 255', () => {
      assert(() => {
        RgbColor.newInstance(1, 23, 456);
      }).to.throwError(/BLUE_MAX/);
    });
  });
});
