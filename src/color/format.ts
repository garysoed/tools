import {Color} from './color';
import {hsl, oklab, oklch, rgb} from './constructors';

type Format = 'hex' | 'hsl' | 'oklab' | 'oklch' | 'rgb';

export function format(color: Color, format: Format): string {
  switch (format) {
    case 'rgb': {
      const rgbColor = rgb(color);
      return `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
    }
    case 'hsl': {
      const hslColor = hsl(color);
      return `hsl(${hslColor.h}, ${hslColor.s}, ${hslColor.l})`;
    }
    case 'oklab': {
      const oklabColor = oklab(color);
      return `oklab(${oklabColor.l}, ${oklabColor.a}, ${oklabColor.b})`;
    }
    case 'oklch': {
      const oklchColor = oklch(color);
      return `oklch(${oklchColor.l}, ${oklchColor.c}, ${oklchColor.h})`;
    }
    case 'hex': {
      const rgbColor = rgb(color);
      const parts = [rgbColor.r, rgbColor.g, rgbColor.b].map((part) => {
        return part.toString(16).padStart(2, '0');
      });
      return `#${parts.join('')}`;
    }
  }
}
