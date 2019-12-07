import { Stream } from '../types/stream';

export function head<T, K = void>(): (from: Stream<T, K>) => T|undefined {
  return (from: Stream<T, K>) => {
    const {done, value} = from().next();

    return done ? undefined : value;
  };
}
