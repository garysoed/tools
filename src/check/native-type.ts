import { BooleanType } from '../check/boolean-type';
import { IType } from '../check/i-type';
import { NumberType } from '../check/number-type';
import { StringType } from '../check/string-type';
import { SymbolType } from '../check/symbol-type';
import { UnionType } from '../check/union-type';

export const NativeType: IType<boolean | number | string | symbol> = UnionType
    .builder<boolean | number | string | symbol>()
    .addType(BooleanType)
    .addType(NumberType)
    .addType(StringType)
    .addType(SymbolType)
    .build();
// TODO: Mutable
