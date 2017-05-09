import { HasPropertyType } from '../check/has-property-type';
import { InstanceofType } from '../check/instanceof-type';
import { IntersectType } from '../check/intersect-type';
import { IterableType } from '../check/iterable-type';
import { Finite } from '../interfaces/finite';

export const FiniteIterableType = IntersectType.builder<Finite<any> & Iterable<any>>()
    .addType(IterableType)
    .addType(HasPropertyType<Finite<any>>('size', InstanceofType(Function)))
    .build();
// TODO: Mutable
