import { TypedGenerator } from '../types/generator';

export function head<T, K = void>(): (from: TypedGenerator<T, K>) => T|undefined {
  return (from: TypedGenerator<T, K>) => {
    const {done, value} = from().next();

    return done ? undefined : value;
  };
}
