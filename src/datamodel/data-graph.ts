import { InstanceofType } from '../check';
import { Searcher } from '../datamodel';
import { Graph, staticId, StaticNodeProvider } from '../graph';
import { StaticId } from '../graph/static-id';
import { ImmutableList, ImmutableSet } from '../immutable';
import { EditableStorage as GsStorage } from '../store';

export interface DataGraph<D> {
  generateId(): Promise<string>;

  get(id: string): Promise<D | null>;

  list(): Promise<ImmutableSet<D>>;

  search(token: string): Promise<ImmutableList<D>>;

  set(id: string, data: D): Promise<void>;
}

export class DataGraphImpl<D> implements DataGraph<D> {
  protected provider_: StaticNodeProvider<DataGraphImpl<D>>;

  constructor(
      protected readonly id_: StaticId<DataGraph<D>>,
      protected readonly searcher_: Searcher<D>,
      protected readonly storage_: GsStorage<D>) { }

  generateId(): Promise<string> {
    return this.storage_.generateId();
  }

  get(id: string): Promise<D | null> {
    return this.storage_.read(id);
  }

  list(): Promise<ImmutableSet<D>> {
    return this.storage_.list();
  }

  search(token: string): Promise<ImmutableList<D>> {
    return this.searcher_.search(token);
  }

  async set(id: string, data: D): Promise<void> {
    const existingItem = await this.storage_.read(id);
    if (existingItem === data) {
      return;
    }
    await this.storage_.update(id, data);
    await this.searcher_.index(this.list());

    await this.provider_(this);
  }

  setProvider_(provider: StaticNodeProvider<DataGraphImpl<D>>): void {
    this.provider_ = provider;
  }
}

export function registerDataGraph<D>(
    name: string,
    searcher: Searcher<D>,
    storage: GsStorage<D>): StaticId<DataGraph<D>> {
  const id = staticId(name, InstanceofType(DataGraphImpl));
  const graph = new DataGraphImpl(id, searcher, storage);
  const provider = Graph.createProvider(id, graph);
  graph.setProvider_(provider);
  return id;
}
