import { TypedGenerator } from './typed-generator';

export function zip<B0>(
    g0: TypedGenerator<B0>,
): <A>(from: TypedGenerator<A>) => TypedGenerator<[A, B0]>;
export function zip<B0, B1>(
    g0: TypedGenerator<B0>,
    g1: TypedGenerator<B1>,
): <A>(from: TypedGenerator<A>) => TypedGenerator<[A, B0, B1]>;
export function zip<B0, B1, B2>(
    g0: TypedGenerator<B0>,
    g1: TypedGenerator<B1>,
    g2: TypedGenerator<B2>,
): <A>(from: TypedGenerator<A>) => TypedGenerator<[A, B0, B1, B2]>;
export function zip(...generators: Array<TypedGenerator<any>>):
    (from: TypedGenerator<any>) => TypedGenerator<any[]> {
  return (from: TypedGenerator<any>) => {
    return function *(): IterableIterator<any[]> {
      const iterables = generators.map(generator => generator());
      for (const valueA of from()) {
        const result = [valueA];
        for (const iterable of iterables) {
          const {value, done} = iterable.next();
          if (done) {
            return;
          }

          result.push(value);
        }

        yield result;
      }
    };
  };
}
