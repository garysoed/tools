import {Converter, StrictConverter, compose, identity, strict} from 'nabu';
import {Observable, Subject, fromEvent, merge} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {listConverter} from '../serializer/list-converter';

import {EditableStorage} from './editable-storage';

export const INDEXES_PARSER = listConverter<string>(identity<string>());

export class WebStorage<T, S> implements EditableStorage<T> {
  private readonly converter: StrictConverter<T, string>;
  private readonly indexesConverter: StrictConverter<readonly string[], string>;
  private readonly onInvalidatedLocally$: Subject<void> = new Subject();

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
    private readonly storage: Storage,
    private readonly prefix: string,
    converter: Converter<T, S>,
    grammar: Converter<S, string>,
  ) {
    this.converter = strict(compose(converter, grammar));
    this.indexesConverter = strict(compose(INDEXES_PARSER, grammar));
  }

  clear(): void {
    for (const id of this.getIds()) {
      this.delete(id);
    }

    this.storage.removeItem(this.prefix);
  }
  delete(id: string): boolean {
    const ids = new Set(this.getIds());
    if (!ids.has(id)) {
      return false;
    }

    this.storage.removeItem(this.getPath(id));
    this.setIds(new Set([...ids].filter((storedId) => storedId !== id)));
    this.onInvalidatedLocally$.next();
    return true;
  }
  has(id: string): Observable<boolean> {
    return this.idList$.pipe(map((ids) => ids.has(id)));
  }
  read(id: string): Observable<T | undefined> {
    const path = this.getPath(id);

    return this.onInvalidate$.pipe(
      startWith({}),
      map(() => this.storage.getItem(path)),
      map((itemStr) => {
        if (!itemStr) {
          return undefined;
        }

        return this.converter.convertBackward(itemStr);
      }),
    );
  }
  update(id: string, instance: T): boolean {
    const ids = this.getIds();
    const hasExistingId = ids.has(id);

    this.storage.setItem(
      this.getPath(id),
      this.converter.convertForward(instance),
    );
    this.setIds(new Set([...ids, id]));
    this.onInvalidatedLocally$.next();
    return hasExistingId;
  }

  get idList$(): Observable<ReadonlySet<string>> {
    return this.onInvalidate$.pipe(
      startWith({}),
      map(() => this.getIds()),
    );
  }

  private getIds(): ReadonlySet<string> {
    const indexesStr = this.storage.getItem(this.prefix);
    if (!indexesStr) {
      return new Set();
    }

    return new Set(this.indexesConverter.convertBackward(indexesStr));
  }
  private getPath(key: string): string {
    return `${this.prefix}/${key}`;
  }
  private setIds(ids: ReadonlySet<string>): void {
    this.storage.setItem(
      this.prefix,
      this.indexesConverter.convertForward([...ids]),
    );
  }

  private get onInvalidate$(): Observable<unknown> {
    return merge(this.onInvalidatedLocally$, fromEvent(window, 'storage'));
  }
}
