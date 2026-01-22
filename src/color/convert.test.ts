import {assert, numberThat, should, test} from 'gs-testing';

import {hsl, rgb} from './constructors';
import {convert} from './convert';

test('@tools/src/color/convert', () => {
  should('convert to rgb correctly', () => {
    assert(convert(hsl({h: 223.78, l: 0.4549, s: 0.6379}), 'rgb')).to.equal({
      b: numberThat().beCloseTo(190, 1),
      g: numberThat().beCloseTo(82, 1),
      r: numberThat().beCloseTo(42, 1),
      space: 'rgb',
    });
  });

  should('convert to hsl correctly', () => {
    assert(convert(rgb({b: 190, g: 82, r: 42}), 'hsl')).to.equal({
      h: numberThat().beCloseTo(223.78, 1),
      l: numberThat().beCloseTo(0.4549, 1),
      s: numberThat().beCloseTo(0.6379, 1),
      space: 'hsl',
    });
  });

  should('convert to oklab correctly', () => {
    assert(convert(rgb({b: 190, g: 82, r: 42}), 'oklab')).to.equal({
      a: numberThat().beCloseTo(-0.01553, 1),
      b: numberThat().beCloseTo(-0.17524, 1),
      l: numberThat().beCloseTo(0.47716, 1),
      space: 'oklab',
    });
  });

  should('convert to oklch correctly', () => {
    assert(convert(rgb({b: 190, g: 82, r: 42}), 'oklch')).to.equal({
      c: numberThat().beCloseTo(0.17593, 1),
      h: numberThat().beCloseTo(264.9356, 1),
      l: numberThat().beCloseTo(0.47716, 1),
      space: 'oklch',
    });
  });
});
