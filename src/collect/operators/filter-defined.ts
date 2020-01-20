import { filter } from './filter';
import { Operator } from './operator';

export function filterDefined<T>():
    Operator<Iterable<T|undefined>, Iterable<Exclude<T, undefined>>> {
  return filter((item): item is Exclude<T, undefined> => item !== undefined);
}
