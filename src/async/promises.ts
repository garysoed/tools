import { ImmutableSet } from '../immutable/immutable-set';
import { Iterables } from '../immutable/iterables';
import { FiniteCollection } from '../interfaces/finite-collection';

export const Promises = {
  forFiniteCollection<T>(collection: FiniteCollection<Promise<T>>): Promise<FiniteCollection<T>> {
    return Promise
        .all(Iterables.toArray(collection))
        .then((values: T[]) => {
          return ImmutableSet.of(values);
        });
  },
};
