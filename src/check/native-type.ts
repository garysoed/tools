import { BooleanType } from '../check/boolean-type';
import { NumberType } from '../check/number-type';
import { StringType } from '../check/string-type';
import { SymbolType } from '../check/symbol-type';
import { Type } from '../check/type';
import { UnionType } from '../check/union-type';

export const NativeType: Type<boolean | number | string | symbol> = UnionType
    .builder<boolean | number | string | symbol>()
    .addType(BooleanType)
    .addType(NumberType)
    .addType(StringType)
    .addType(SymbolType)
    .build();
