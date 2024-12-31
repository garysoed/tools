import {Converter, Result} from 'nabu';

class IterableConverter<T, I extends Iterable<T>>
  implements Converter<I, unknown>
{
  constructor(
    private readonly iterableProvider_: (content: Iterable<T>) => I,
    private readonly itemConverter_: Converter<T, unknown>,
  ) {}

  convertBackward(value: unknown): Result<I> {
    if (!(value instanceof Array)) {
      return {success: false};
    }

    const convertedItems: T[] = [];
    for (const item of value) {
      const conversionResult = this.itemConverter_.convertBackward(item);
      if (!conversionResult.success) {
        return {success: false};
      }

      convertedItems.push(conversionResult.result);
    }

    return {result: this.iterableProvider_(convertedItems), success: true};
  }
  convertForward(input: I): Result<unknown> {
    const convertedItems: unknown[] = [];
    for (const item of input) {
      const conversionResult = this.itemConverter_.convertForward(item);
      if (!conversionResult.success) {
        return {success: false};
      }

      convertedItems.push(conversionResult.result);
    }

    return {result: convertedItems, success: true};
  }
}

export function iterableConverter<T, I extends Iterable<T>>(
  provider: (content: Iterable<T>) => I,
  itemConverter: Converter<T, unknown>,
): IterableConverter<T, I> {
  return new IterableConverter(provider, itemConverter);
}
