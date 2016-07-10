import {TestBase} from '../test-base';
TestBase.setup();

import {RgbColor} from './rgb-color';


describe('color.RgbColor', () => {
  describe('chroma', () => {
    it('should return the correct value of chroma', () => {
      expect(RgbColor.newInstance(126, 126, 184).chroma).toBeCloseTo(0.23, 2);
    });
  });

  describe('hue', () => {
    it('should return the correct value of hue', () => {
      expect(RgbColor.newInstance(126, 126, 184).hue).toBeCloseTo(240, 0);
    });
  });

  describe('lightness', () => {
    it('should return the correct value of lightness', () => {
      expect(RgbColor.newInstance(126, 126, 184).lightness).toBeCloseTo(0.608, 3);
    });
  });

  describe('luminance', () => {
    it('should return the correct value of luminance', () => {
      expect(RgbColor.newInstance(126, 126, 184).luminance).toBeCloseTo(0.23, 2);
    });
  });

  describe('saturation', () => {
    it('should return the correct value of saturation', () => {
      expect(RgbColor.newInstance(126, 126, 184).saturation).toBeCloseTo(0.290, 3);
    });
  });

  describe('newInstance', () => {
    it('should create the correct color object', () => {
      let color = RgbColor.newInstance(1, 23, 45);
      expect(color.red).toEqual(1);
      expect(color.green).toEqual(23);
      expect(color.blue).toEqual(45);
    });

    it('should throw error if red is not an integer', () => {
      expect(() => {
        RgbColor.newInstance(1.23, 23, 45);
      }).toThrowError(/RED_INT/);
    });

    it('should throw error if red is negative', () => {
      expect(() => {
        RgbColor.newInstance(-1, 23, 45);
      }).toThrowError(/RED_MIN/);
    });

    it('should throw error if red is > 255', () => {
      expect(() => {
        RgbColor.newInstance(1234, 23, 45);
      }).toThrowError(/RED_MAX/);
    });

    it('should throw error if green is not an integer', () => {
      expect(() => {
        RgbColor.newInstance(1, 23.45, 45);
      }).toThrowError(/GREEN_INT/);

    });

    it('should throw error if green is negative', () => {
      expect(() => {
        RgbColor.newInstance(1, -23, 45);
      }).toThrowError(/GREEN_MIN/);
    });

    it('should throw error if green is > 255', () => {
      expect(() => {
        RgbColor.newInstance(1, 2345, 45);
      }).toThrowError(/GREEN_MAX/);
    });

    it('should throw error if blue is not an integer', () => {
      expect(() => {
        RgbColor.newInstance(1, 23, 4.5);
      }).toThrowError(/BLUE_INT/);
    });

    it('should throw error if blue is negative', () => {
      expect(() => {
        RgbColor.newInstance(1, 23, -45);
      }).toThrowError(/BLUE_MIN/);
    });

    it('should throw error if blue is > 255', () => {
      expect(() => {
        RgbColor.newInstance(1, 23, 456);
      }).toThrowError(/BLUE_MAX/);
    });
  });
});
