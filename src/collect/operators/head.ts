import { Operator } from './operator';

export function head<T>(): Operator<Iterable<T>, T|undefined> {
  return (fromIterable: Iterable<T>) => {
    for (const item of fromIterable) {
      return item;
    }

    return undefined;
  };
}
