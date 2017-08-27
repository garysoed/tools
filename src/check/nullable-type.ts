import { IType } from '../check/i-type';
import { NullType } from '../check/null-type';
import { UnionType } from '../check/union-type';

export function NullableType<T>(type: IType<T>): IType<T | null> {
  return UnionType.builder<T | null>()
      .addType(type)
      .addType(NullType)
      .build();
}
