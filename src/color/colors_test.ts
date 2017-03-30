import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Colors } from '../color/colors';
import { RgbColor } from "src/color/rgb-color";


describe('namespace.Colors ', () => {
  describe('getContrast', () => {
    fit('should return the correct contrast ratio', () => {
      const foreground = RgbColor.newInstance(0x12, 0x34, 0x56);
      const background = RgbColor.newInstance(0x78, 0x9a, 0xbc);
      assert(Colors.getContrast(foreground, background)).to.beCloseTo(4.3, 0.01);
    });
  });

  describe('mix', () => {
    fit('should return the correct color', () => {
      const color1 = RgbColor.newInstance(0x12, 0x34, 0x56);
      const color2 = RgbColor.newInstance(0x78, 0x9a, 0xbc);
      const mix = Colors.mix(color1, color2, 0.75);
      assert(mix.getRed()).to.equal(44);
      assert(mix.getGreen()).to.equal(78);
      assert(mix.getBlue()).to.equal(112);
    });
  });
});
