import {assert, should, test} from 'gs-testing';

import {adjustLightnessToLuminance} from './adjust_lightness_to_luminance';
import {rgb} from './constructors';
import {luminance} from './luminance';

test('@tools/src/color/adjust_lightness_to_luminance', () => {
  should('adjust lightness to match target luminance', () => {
    const base = rgb({b: 0, g: 0, r: 100}); // Dark red
    const target = 0.5;
    const adjusted = adjustLightnessToLuminance(base, target);

    assert(Math.abs(luminance(adjusted) - target) < 0.01).to.beTrue();
  });

  should('handle white target', () => {
    const base = rgb({b: 0, g: 0, r: 0});
    const target = 1;
    const adjusted = adjustLightnessToLuminance(base, target);

    assert(Math.abs(luminance(adjusted) - target) < 0.01).to.beTrue();
  });

  should('handle black target', () => {
    const base = rgb({b: 255, g: 255, r: 255});
    const target = 0;
    const adjusted = adjustLightnessToLuminance(base, target);

    assert(Math.abs(luminance(adjusted) - target) < 0.01).to.beTrue();
  });
});
