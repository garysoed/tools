import { Color } from '../interfaces/color';
import { AssertFactory } from '../jasmine/assert-factory';
import { ColorAssert } from '../jasmine/color-assert';


export function assertColor(value: Color): AssertFactory<ColorAssert> {
  return new AssertFactory((reversed: boolean): ColorAssert => {
    return new ColorAssert(value, reversed, expect);
  });
}
