import { Converter, Result } from 'nabu';

class FloatConverter implements Converter<number, unknown> {
  convertBackward(input: unknown): Result<number> {
    if (typeof input !== 'number') {
      return {success: false};
    }

    return {result: input, success: true};
  }

  convertForward(value: number): Result<unknown> {
    return {result: value, success: true};
  }
}

export function floatConverter(): FloatConverter {
  return new FloatConverter();
}
