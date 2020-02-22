import { assert, should } from 'gs-testing';
import { fake, spy } from 'gs-testing';
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
      fake(spy(color, 'getRed')).always().return(126);
      fake(spy(color, 'getGreen')).always().return(126);
      fake(spy(color, 'getBlue')).always().return(184);
      assert(color.getLuminance()).to.beCloseTo(0.23, 2);
    });
  });
});


