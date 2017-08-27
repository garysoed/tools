import { NullType } from '../check/null-type';
import { Type } from '../check/type';
import { UnionType } from '../check/union-type';

export function NullableType<T>(type: Type<T>): Type<T | null> {
  return UnionType.builder<T | null>()
      .addType(type)
      .addType(NullType)
      .build();
}
