import { TypedGenerator } from './typed-generator';
import { Operator } from './operator';

export function head<T>(): Operator<TypedGenerator<T>, T|undefined> {
  return (from: TypedGenerator<T>) => {
    const {done, value} = from().next();

    return done ? undefined : value;
  };
}
