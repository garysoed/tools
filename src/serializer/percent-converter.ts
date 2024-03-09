import {Converter, Result} from 'nabu';

class PercentConverter implements Converter<number, unknown> {
  convertBackward(value: unknown): Result<number> {
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
    } catch {
      return {success: false};
    }
  }

  convertForward(input: number): Result<unknown> {
    return {result: `${(input * 100).toString(10)}%`, success: true};
  }
}

export function percentConverter(): PercentConverter {
  return new PercentConverter();
}
