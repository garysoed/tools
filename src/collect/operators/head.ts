import { IterableFactory } from './iterable-factory';
import { Operator } from './operator';

export function head<T>(): Operator<IterableFactory<T>, T|undefined> {
  return (from: IterableFactory<T>) => {
    const {done, value} = from().next();

    return done ? undefined : value;
  };
}
