import { assert } from 'gs-testing/export/main';
import { BaseColor } from '../color/base-color';

// tslint:disable:prefer-function-over-method
class TestColor extends BaseColor {
  getBlue(): number { return 0; }

  getChroma(): number { return 0; }

  getGreen(): number { return 0; }

  getHue(): number { return 0; }

  getLightness(): number { return 0; }

  getRed(): number { return 0; }

  getSaturation(): number { return 0; }
}
// tslint:enable

describe('color.BaseColor', () => {
  let color: BaseColor;

  beforeEach(() => {
    color = new TestColor();
  });

  describe('getLuminance', () => {
    should('return the correct value of luminance', () => {
      spyOn(color, 'getRed').and.returnValue(126);
      spyOn(color, 'getGreen').and.returnValue(126);
      spyOn(color, 'getBlue').and.returnValue(184);
      assert(color.getLuminance()).to.beCloseTo(0.23, 2);
    });
  });
});


