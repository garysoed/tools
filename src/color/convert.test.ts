import {assert, should, test} from 'gs-testing';

import {convert} from './convert';

test('@tools/src/color/convert', () => {
  should.only('convert to rgb correctly', () => {
    assert(
      convert({h: 223.78, l: 0.4549, s: 0.6379, space: 'hsl'}, 'rgb'),
    ).to.equal({
      b: 190,
      g: 82,
      r: 42,
      space: 'rgb',
    });
  });

  should.only('convert to hsl correctly', () => {
    assert(convert({b: 190, g: 82, r: 42, space: 'rgb'}, 'hsl')).to.equal({
      h: 223.78,
      l: 0.4549,
      s: 0.6379,
      space: 'hsl',
    });
  });

  should.only('convert to oklab correctly', () => {
    assert(convert({b: 190, g: 82, r: 42, space: 'rgb'}, 'oklab')).to.equal({
      a: -0.01553,
      b: -0.17524,
      l: 0.47716,
      space: 'oklab',
    });
  });

  should.only('convert to oklch correctly', () => {
    assert(convert({b: 190, g: 82, r: 42, space: 'rgb'}, 'oklch')).to.equal({
      c: 0.17593,
      h: 264.9356,
      l: 0.47716,
      space: 'oklch',
    });
  });
});
