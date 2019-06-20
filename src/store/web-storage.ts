import { binary, compose, Converter, identity, Serializable, strict, StrictConverter } from '@nabu';
import { Observable } from '@rxjs';
import { map, shareReplay, take, tap } from '@rxjs/operators';
import { createImmutableList, ImmutableList } from '../collect/types/immutable-list';
import { createImmutableSet } from '../collect/types/immutable-set';
import { cache } from '../data/cache';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { mapNonNull } from '../rxjs/map-non-null';
import { ArrayDiff } from '../rxjs/state/array-observable';
import { diffArray } from '../rxjs/state/diff-array';
import { WebStorageObservable } from '../rxjs/web-storage-observable';
import { listConverter } from '../serializer/list-converter';
import { EditableStorage } from './editable-storage';

export const INDEXES_PARSER = listConverter<string>(identity<string>());

export class WebStorage<T> implements EditableStorage<T> {
  private readonly converter: StrictConverter<T, string>;
  private readonly idGenerator: BaseIdGenerator = new SimpleIdGenerator();
  private readonly indexesConverter: StrictConverter<ImmutableList<string>, string>;
  private readonly storage: WebStorageObservable;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
      storage: Storage,
      private readonly prefix: string,
      converter: Converter<T, Serializable>,
  ) {
    this.storage = new WebStorageObservable(storage);

    const binaryGrammar = binary();
    this.converter = strict(compose(converter, binaryGrammar));
    this.indexesConverter = strict(compose(INDEXES_PARSER, binaryGrammar));
  }

  clear(): Observable<unknown> {
    return this.storage.clear();
  }

  delete(id: string): Observable<unknown> {
    return this.listIdsAsArray()
        .pipe(
            take(1),
            tap(ids => {
              const newArray = ids.filter(v => v !== id);
              const result = this.indexesConverter.convertForward(createImmutableList(newArray));
              this.storage.setItem(this.prefix, result);
              this.storage.removeItem(getPath(id, this.prefix));
            }),
        );
  }

  deleteAt(index: number): Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  findIndex(id: string): Observable<number | null> {
    throw new Error('Method not implemented.');
  }

  generateId(): Observable<string> {
    return this.listIdsAsArray()
        .pipe(
            map(ids => this.idGenerator.generate(ids)),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.listIdsAsArray()
        .pipe(
            map(ids => ids.indexOf(id) >= 0),
            shareReplay(1),
        );
  }

  insertAt(index: number, id: string, instance: T): Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  listIds(): Observable<ArrayDiff<string>> {
    return this.listIdsAsArray().pipe(diffArray());
  }

  read(id: string): Observable<T|null> {
    const path = getPath(id, this.prefix);

    return this.storage.getItem(path)
        .pipe(
            mapNonNull(itemStr => this.converter.convertBackward(itemStr)),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): Observable<unknown> {
    const path = getPath(id, this.prefix);

    return this.listIdsAsArray()
        .pipe(
            take(1),
            tap(ids => {
              const newIds = this.indexesConverter.convertForward(
                  createImmutableSet(new Set([...ids, id])),
              );
              this.storage.setItem(this.prefix, newIds);

              const itemResult = this.converter.convertForward(instance);
              this.storage.setItem(path, itemResult);
            }),
        );
  }

  updateAt(index: number, id: string, instance: T): Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  @cache()
  private listIdsAsArray(): Observable<string[]> {
    return this.storage.getItem(this.prefix)
        .pipe(
            map(indexesStr => {
              if (!indexesStr) {
                return createImmutableList<string>();
              }

              return this.indexesConverter.convertBackward(indexesStr);
            }),
            map(immutableList => [...immutableList]),
            shareReplay(1),
        );
  }
}

function getPath(key: string, prefix: string): string {
  return `${prefix}/${key}`;
}
