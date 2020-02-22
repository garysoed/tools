import { Type } from 'gs-types';
import { Converter, Result, Serializable } from 'nabu';

class TypeBasedConverter<T extends Serializable> implements Converter<T, Serializable> {
  constructor(private readonly type: Type<T>) { }

  convertBackward(value: Serializable): Result<T> {
    if (!this.type.check(value)) {
      return {success: false};
    }

    return {result: value, success: true};
  }

  convertForward(input: T): Result<Serializable> {
    return {result: input, success: true};
  }
}

export function typeBased<T extends Serializable>(type: Type<T>): TypeBasedConverter<T> {
  return new TypeBasedConverter(type);
}
