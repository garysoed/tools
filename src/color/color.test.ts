import { assert, should, test } from 'gs-testing';

import { Color } from './color';

class TestColor extends Color {
  constructor(
      readonly red: number,
      readonly green: number,
      readonly blue: number,
  ) {
    super();
  }

  get chroma(): number {
    throw new Error('Method not implemented.');
  }

  get hue(): number {
    throw new Error('Method not implemented.');
  }

  get lightness(): number {
    throw new Error('Method not implemented.');
  }

  get saturation(): number {
    throw new Error('Method not implemented.');
  }
}

test('color.Color', () => {
  test('@tools/color/color', () => {
    should('return the correct value of luminance', () => {
      const color = new TestColor(126, 126, 184);

      assert(color.luminance).to.beCloseTo(0.23, 2);
    });
  });
});
