import { compose, Converter, identity, Serializable, strict, StrictConverter } from 'nabu';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { listConverter } from '../serializer/list-converter';

import { EditableStorage } from './editable-storage';


export const INDEXES_PARSER = listConverter<string>(identity<string>());

export class WebStorage<T> implements EditableStorage<T> {
  private readonly onInvalidatedLocally$: Subject<void> = new Subject();

  private readonly converter: StrictConverter<T, string>;
  private readonly indexesConverter: StrictConverter<readonly string[], string>;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
      private readonly storage: Storage,
      private readonly prefix: string,
      converter: Converter<T, Serializable>,
      grammar: Converter<Serializable, string>,
      private readonly idGenerator: BaseIdGenerator = new SimpleIdGenerator(),
  ) {
    this.converter = strict(compose(converter, grammar));
    this.indexesConverter = strict(compose(INDEXES_PARSER, grammar));
  }

  add(instance: T): string {
    const ids = this.getIds();
    const newId = this.idGenerator.generate(ids);

    this.setIds([...ids, newId]);

    this.storage.setItem(this.getPath(newId), this.converter.convertForward(instance));
    this.onInvalidatedLocally$.next();
    return newId;
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
    this.setIds([...ids].filter(storedId => storedId !== id));
    this.onInvalidatedLocally$.next();
    return true;
  }

  has(id: string): Observable<boolean> {
    return this.idList$.pipe(map(ids => ids.has(id)));
  }

  get idList$(): Observable<ReadonlySet<string>> {
    return this.onInvalidate$.pipe(
        startWith({}),
        map(() => new Set(this.getIds())),
    );
  }

  read(id: string): Observable<T|undefined> {
    const path = this.getPath(id);

    return this.onInvalidate$.pipe(
        startWith({}),
        map(() => this.storage.getItem(path)),
        map(itemStr => {
          if (!itemStr) {
            return undefined;
          }

          return this.converter.convertBackward(itemStr);
        }),
    );
  }

  update(id: string, instance: T): boolean {
    const ids = new Set(this.getIds());
    if (!ids.has(id)) {
      return false;
    }

    this.storage.setItem(this.getPath(id), this.converter.convertForward(instance));
    this.onInvalidatedLocally$.next();
    return true;
  }

  private getIds(): readonly string[] {
    const indexesStr = this.storage.getItem(this.prefix);
    if (!indexesStr) {
      return [];
    }

    return this.indexesConverter.convertBackward(indexesStr);
  }

  private getPath(key: string): string {
    return `${this.prefix}/${key}`;
  }

  private get onInvalidate$(): Observable<unknown> {
    return merge(this.onInvalidatedLocally$, fromEvent(window, 'storage'));
  }

  private setIds(ids: readonly string[]): void {
    this.storage.setItem(this.prefix, this.indexesConverter.convertForward(ids));
  }
}
