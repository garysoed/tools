import {assert, should, test} from 'gs-testing';

import {rgb} from './color';
import {contrast} from './contrast';

test('@tools/src/color/contrast', () => {
  should('return the correct contrast ratio', () => {
    const foreground = rgb({b: 0x56, g: 0x34, r: 0x12});
    const background = rgb({b: 0xbc, g: 0x9a, r: 0x78});
    assert(contrast(foreground, background)).to.beCloseTo(4.3, 0.01);
  });
});
