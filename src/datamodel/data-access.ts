import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';

type Getter<T> = (id: string) => Promise<T | null>;
type Lister<T> = () => Promise<ImmutableSet<T>>;
type Searcher<T> = (token: string) => Promise<ImmutableList<T>>;

export class DataAccess<D> {
  constructor(
      private readonly getter_: Getter<D>,
      private readonly lister_: Lister<D>,
      private readonly searcher_: Searcher<D>,
      private readonly updateQueue_: ImmutableMap<string, D>) { }

  get(id: string): Promise<D | null> {
    return this.getter_(id);
  }

  getUpdateQueue(): ImmutableMap<string, D> {
    return this.updateQueue_;
  }

  list(): Promise<ImmutableSet<D>> {
    return this.lister_();
  }

  queueUpdate(id: string, data: D): DataAccess<D> {
    return new DataAccess<D>(
        this.getter_, this.lister_, this.searcher_, this.updateQueue_.set(id, data));
  }

  search(token: string): Promise<ImmutableList<D>> {
    return this.searcher_(token);
  }

  static of<D>(getter: Getter<D>, lister: Lister<D>, searcher: Searcher<D>): DataAccess<D> {
    return new DataAccess(getter, lister, searcher, ImmutableMap.of<string, D>([]));
  }
}
