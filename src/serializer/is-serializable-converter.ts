import { Converter, Result, Serializable } from '@nabu';
import { IsSerializable } from './is-serializable';

class IsSerializableConverter<T extends IsSerializable> implements Converter<T, Serializable> {
  constructor(private readonly ctor_: new (data: Serializable) => T) { }

  convertBackward(value: Serializable): Result<T> {
    return {result: new this.ctor_(value), success: true};
  }

  convertForward(input: T): Result<Serializable> {
    return {result: input.serialize(), success: true};
  }
}

export function isSerializable<T extends IsSerializable>(
    ctor: new (data: Serializable) => T,
): IsSerializableConverter<T> {
  return new IsSerializableConverter(ctor);
}
