import { Converter, Result, Serializable } from 'nabu/export/main';

class FloatConverter implements Converter<number, Serializable> {
  convertBackward(input: Serializable): Result<number> {
    if (typeof input !== 'number') {
      return {success: false};
    }

    return {result: input, success: true};
  }

  convertForward(value: number): Result<Serializable> {
    return {result: value, success: true};
  }
}

export function floatConverter(): FloatConverter {
  return new FloatConverter();
}
