import { HasPropertyType } from '../check/has-property-type';
import { InstanceofType } from '../check/instanceof-type';

// TODO: DELETE

export const IterableType = HasPropertyType<Iterable<any>>(
    Symbol.iterator, InstanceofType(Function));
