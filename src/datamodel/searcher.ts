import { ImmutableList } from '../immutable/immutable-list';

export interface Searcher<D> {
  reset(): void;

  search(token: string): Promise<ImmutableList<D>>;
}
