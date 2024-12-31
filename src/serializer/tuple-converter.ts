import {Converter, Result} from 'nabu';

class TupleConverter<T extends unknown[]> implements Converter<T, unknown> {
  constructor(
    private readonly elementConverters_: Array<Converter<unknown, unknown>>,
  ) {}

  convertBackward(value: unknown): Result<T> {
    if (!(value instanceof Array)) {
      return {success: false};
    }

    if (value.length !== this.elementConverters_.length) {
      return {success: false};
    }

    const convertedTuple: T = [] as any;
    for (let i = 0; i < value.length; i++) {
      const converter = this.elementConverters_[i];
      if (!converter) {
        return {success: false};
      }

      const conversionResult = converter.convertBackward(value[i]);
      if (!conversionResult.success) {
        return {success: false};
      }
      convertedTuple.push(conversionResult.result);
    }

    return {result: convertedTuple, success: true};
  }
  convertForward(input: T): Result<unknown> {
    const convertedTuple: unknown[] = [];
    for (let i = 0; i < input.length; i++) {
      const converter = this.elementConverters_[i];
      if (!converter) {
        return {success: false};
      }

      const conversionResult = converter.convertForward(input[i]);
      if (!conversionResult.success) {
        return {success: false};
      }
      convertedTuple.push(conversionResult.result);
    }

    return {result: convertedTuple, success: true};
  }
}
export function tupleConverter<T0>(
  elementConverters: [Converter<T0, unknown>],
): TupleConverter<[T0]>;
export function tupleConverter<T0, T1>(
  elementConverters: [Converter<T0, unknown>, Converter<T1, unknown>],
): TupleConverter<[T0, T1]>;
export function tupleConverter<T extends unknown[]>(
  elementConverters: Array<Converter<unknown, unknown>>,
): TupleConverter<T> {
  return new TupleConverter(elementConverters);
}
