import { DataModel } from '../datamodel/data-model';
import { Searcher } from '../datamodel/searcher';
import { ImmutableList } from '../immutable';

export class SimpleSearcher<T extends DataModel<string>> implements Searcher<T> {
  private readonly index_: Map<string, Iterable<T>> = new Map();

  async index(data: Promise<Iterable<T>>): Promise<void> {
    const items = await data;
    this.index_.clear();
    for (const item of items) {
      const index = item.getSearchIndex();
      const existing = this.index_.get(index) || [];
      this.index_.set(index, [...existing, item]);
    }
  }

  async search(token: string): Promise<ImmutableList<T>> {
    const items = this.index_.get(token);
    if (!items) {
      return ImmutableList.of([]);
    }
    return ImmutableList.of([...items]);
  }
}
