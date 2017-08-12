import { Promises } from '../async';
import { DataAccess } from '../datamodel/data-access';
import { DataModel } from '../datamodel/data-model';
import { Searcher } from '../datamodel/searcher';
import { Bus } from '../event';
import { ImmutableList, ImmutableSet } from '../immutable';
import { Monad } from '../interfaces';
import { Storage as GsStorage } from '../store';
import { Log } from '../util';

type EventType = 'add' | 'remove' | 'edit';
export type ManagerEvent<T extends DataModel<any>> = {data: T, type: EventType};

export abstract class Manager<D extends DataModel<any>>
    extends Bus<EventType, ManagerEvent<D>> {
  constructor(
      protected readonly storage_: GsStorage<D>,
      protected readonly searcher_: Searcher<D>,
      logger: Log) {
    super(logger);
  }

  private get_(id: string): Promise<D | null> {
    return this.storage_.read(id);
  }

  idMonad(): Monad<Promise<string>> {
    const id = this.storage_.generateId();
    return {
      get: () => {
        return id;
      },

      set: () => {
        // Noop
      },
    };
  }

  private list_(): Promise<ImmutableSet<D>> {
    return this.storage_.list();
  }

  monad(): Monad<DataAccess<D>> {
    return {
      get: () => {
        return DataAccess.of<D>(
            this.get_.bind(this),
            this.list_.bind(this),
            this.search_.bind(this));
      },

      set: (dataAccess: DataAccess<D>) => {
        return Promises
            .forFiniteCollection(dataAccess
                .getUpdateQueue()
                .map((item: D, id: string) => {
                  return this.update_(id, item);
                })
                .values());
      },
    };
  }

  private search_(this: Manager<D>, token: string): Promise<ImmutableList<D>> {
    return this.searcher_.search(token);
  }

  private async update_(id: string, item: D): Promise<void> {
    const existingItem = await this.storage_.read(id);
    await this.storage_.update(id, item);

    this.dispatch({data: item, type: existingItem ? 'edit' : 'add'});

    this.searcher_.index(this.list_());
  }
}
