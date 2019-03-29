import { Converter, Result, Serializable } from '@nabu/main';

class IntegerConverter implements Converter<number, Serializable> {
  constructor(private readonly round_: boolean) { }

  convertBackward(value: Serializable): Result<number> {
    if (typeof value !== 'number') {
      return {success: false};
    }

    const rounded = Math.round(value);
    if (this.round_) {
      return {result: rounded, success: true};
    }

    if (value !== rounded) {
      return {success: false};
    }

    return {result: value, success: true};
  }

  convertForward(input: number): Result<Serializable> {
    if (Math.round(input) !== input) {
      return {success: false};
    }

    return {result: input, success: true};
  }
}

export function integerConverter(round: boolean = true): IntegerConverter {
  return new IntegerConverter(round);
}
