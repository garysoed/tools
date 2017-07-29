import { ImmutableSet } from '../immutable';
import { FiniteCollection } from '../interfaces';

export const Promises = {
  forFiniteCollection<T>(collection: FiniteCollection<Promise<T>>): Promise<FiniteCollection<T>> {
    return Promise
        .all([...collection])
        .then((values: T[]) => {
          return ImmutableSet.of(values);
        });
  },
};
