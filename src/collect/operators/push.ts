import { copyMetadata } from '../generators';
import { IsFinite } from '../is-finite';
import { TypedGenerator } from '../typed-generator';

export function push<T>(...items: T[]):
    (from: TypedGenerator<T> & IsFinite) => TypedGenerator<T> & IsFinite {
  return (from: TypedGenerator<T> & IsFinite) => {
    return copyMetadata(
        function *(): IterableIterator<T> {
          yield* from();
          for (const item of items) {
            yield item;
          }
        },
        from,
    );
  };
}
