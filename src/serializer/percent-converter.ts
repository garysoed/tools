import { Converter, Result, Serializable } from '@nabu/main';

class PercentConverter implements Converter<number, Serializable> {
  convertBackward(value: Serializable): Result<number> {
    if (typeof value !== 'string') {
      return {success: false};
    }

    if (!value.endsWith('%')) {
      return {success: false};
    }

    try {
      const float = Number.parseFloat(value.substring(0, value.length - 1));

      if (isNaN(float)) {
        return {success: false};
      }

      return {result: float / 100, success: true};
    } catch (e) {
      return {success: false};
    }
  }

  convertForward(input: number): Result<Serializable> {
    return {result: `${(input * 100).toString(10)}%`, success: true};
  }
}

export function percentConverter(): PercentConverter {
  return new PercentConverter();
}
