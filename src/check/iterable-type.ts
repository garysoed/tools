import { HasPropertyType } from '../check/has-property-type';
import { InstanceofType } from '../check/instanceof-type';

export const IterableType = HasPropertyType<Iterable<any>>(
    Symbol.iterator, InstanceofType(Function));
// TODO: Mutable
