import { Converter, Result } from 'nabu';

import { IsSerializable } from './is-serializable';

class IsSerializableConverter<T extends IsSerializable> implements Converter<T, unknown> {
  constructor(private readonly ctor_: new (data: unknown) => T) { }

  convertBackward(value: unknown): Result<T> {
    return {result: new this.ctor_(value), success: true};
  }

  convertForward(input: T): Result<unknown> {
    return {result: input.serialize(), success: true};
  }
}

export function isSerializable<T extends IsSerializable>(
    ctor: new (data: unknown) => T,
): IsSerializableConverter<T> {
  return new IsSerializableConverter(ctor);
}
