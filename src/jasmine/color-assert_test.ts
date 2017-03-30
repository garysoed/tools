import { TestBase } from '../test-base';
TestBase.setup();

import { ColorAssert } from '../jasmine/color-assert';


describe('jasmine.ColorAssert', () => {
  let mockColor;
  let mockExpect;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    mockColor = jasmine.createSpyObj('Color', [
      'getBlue',
      'getGreen',
      'getHue',
      'getLightness',
      'getRed',
      'getSaturation',
    ]);
  });

  describe('haveHsl', () => {
    it('should call the matchers correctly', () => {
      const actualHue = 123;
      const actualSaturation = 0.45;
      const actualLightness = 0.56;
      mockColor.getHue.and.returnValue(actualHue);
      mockColor.getSaturation.and.returnValue(actualSaturation);
      mockColor.getLightness.and.returnValue(actualLightness);

      const hue = 78;
      const saturation = 0.9;
      const lightness = 0.12;
      const mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      mockExpect.and.returnValue(mockMatchers);


      const assert = new ColorAssert(mockColor, false /* reversed */, mockExpect);
      assert.haveHsl(hue, saturation, lightness);
      expect(mockMatchers.toEqual).toHaveBeenCalledWith([hue, saturation, lightness]);
      expect(mockExpect).toHaveBeenCalledWith([actualHue, actualSaturation, actualLightness]);
    });

    it('should call the matchers correctly when reversed', () => {
      const actualHue = 123;
      const actualSaturation = 0.45;
      const actualLightness = 0.56;
      mockColor.getHue.and.returnValue(actualHue);
      mockColor.getSaturation.and.returnValue(actualSaturation);
      mockColor.getLightness.and.returnValue(actualLightness);

      const hue = 78;
      const saturation = 0.9;
      const lightness = 0.12;
      const mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatchers});

      const assert = new ColorAssert(mockColor, true /* reversed */, mockExpect);
      assert.haveHsl(hue, saturation, lightness);
      expect(mockMatchers.toEqual).toHaveBeenCalledWith([hue, saturation, lightness]);
      expect(mockExpect).toHaveBeenCalledWith([actualHue, actualSaturation, actualLightness]);
    });
  });

  describe('haveRgb', () => {
    it('should call the matchers correctly', () => {
      const actualRed = 123;
      const actualGreen = 45;
      const actualBlue = 67;
      mockColor.getRed.and.returnValue(actualRed);
      mockColor.getGreen.and.returnValue(actualGreen);
      mockColor.getBlue.and.returnValue(actualBlue);

      const red = 89;
      const green = 12;
      const blue = 34;
      const mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      mockExpect.and.returnValue(mockMatchers);

      const assert = new ColorAssert(mockColor, false /* reversed */, mockExpect);
      assert.haveRgb(red, green, blue);
      expect(mockMatchers.toEqual).toHaveBeenCalledWith([red, green, blue]);
      expect(mockExpect).toHaveBeenCalledWith([actualRed, actualGreen, actualBlue]);
    });

    it('should call the matchers correctly when reversed', () => {
      const actualRed = 123;
      const actualGreen = 45;
      const actualBlue = 67;
      mockColor.getRed.and.returnValue(actualRed);
      mockColor.getGreen.and.returnValue(actualGreen);
      mockColor.getBlue.and.returnValue(actualBlue);

      const red = 89;
      const green = 12;
      const blue = 34;
      const mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatchers});

      const assert = new ColorAssert(mockColor, true /* reversed */, mockExpect);
      assert.haveRgb(red, green, blue);
      expect(mockMatchers.toEqual).toHaveBeenCalledWith([red, green, blue]);
      expect(mockExpect).toHaveBeenCalledWith([actualRed, actualGreen, actualBlue]);
    });
  });
});
