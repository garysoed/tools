import { DataModel } from '../datamodel/data-model';
import { ImmutableList } from '../immutable/immutable-list';

export interface Searcher<D extends DataModel<any>> {
  index(data: Promise<Iterable<D>>): Promise<void>;

  search(token: string): Promise<ImmutableList<D>>;
}
