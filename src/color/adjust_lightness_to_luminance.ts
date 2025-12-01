import {Color} from './color';
import {convert} from './convert';
import {luminance} from './luminance';

export function adjustLightnessToLuminance(
  baseColor: Color,
  targetLuminance: number,
  threshold = 0.01,
): Color {
  const originalSpace = baseColor.space;
  const workingColor = convert(baseColor, 'hsl');

  let min = 0;
  let max = 1;
  let current = workingColor;

  // Binary search for lightness
  for (let i = 0; i < 20; i++) {
    const mid = (min + max) / 2;
    current = {...workingColor, l: mid};
    const lum = luminance(current);

    if (Math.abs(lum - targetLuminance) <= threshold) {
      return convert(current, originalSpace);
    }

    if (lum < targetLuminance) {
      min = mid;
    } else {
      max = mid;
    }
  }

  return convert(current, originalSpace);
}
