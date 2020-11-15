import {Type} from 'gs-types';
import {Converter, Result} from 'nabu';

class TypeBasedConverter<T> implements Converter<T, unknown> {
  constructor(private readonly type: Type<T>) { }

  convertBackward(value: unknown): Result<T> {
    if (!this.type.check(value)) {
      return {success: false};
    }

    return {result: value, success: true};
  }

  convertForward(input: T): Result<unknown> {
    return {result: input, success: true};
  }
}

export function typeBased<T extends unknown>(type: Type<T>): TypeBasedConverter<T> {
  return new TypeBasedConverter(type);
}
