import {assert, should, test} from 'gs-testing';

import {hsl, rgb} from './constructors';
import {convert} from './convert';

test('@tools/src/color/convert', () => {
  should('convert to rgb correctly', () => {
    assert(convert(hsl({h: 223.78, l: 0.4549, s: 0.6379}), 'rgb')).to.equal({
      b: 190,
      g: 82,
      r: 42,
      space: 'rgb',
    });
  });

  should('convert to hsl correctly', () => {
    assert(convert(rgb({b: 190, g: 82, r: 42}), 'hsl')).to.equal({
      h: 223.78,
      l: 0.4549,
      s: 0.6379,
      space: 'hsl',
    });
  });

  should('convert to oklab correctly', () => {
    assert(convert(rgb({b: 190, g: 82, r: 42}), 'oklab')).to.equal({
      a: -0.01553,
      b: -0.17524,
      l: 0.47716,
      space: 'oklab',
    });
  });

  should('convert to oklch correctly', () => {
    assert(convert(rgb({b: 190, g: 82, r: 42}), 'oklch')).to.equal({
      c: 0.17593,
      h: 264.9356,
      l: 0.47716,
      space: 'oklch',
    });
  });
});
