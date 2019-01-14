import { TypedGenerator } from '../types/generator';

export function head<T>(): (from: TypedGenerator<T>) => T|undefined {
  return <T>(from: TypedGenerator<T>) => {
    const {done, value} = from().next();

    return done ? undefined : value;
  };
}
