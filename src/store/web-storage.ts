import { binary, compose, Converter, identity, Serializable, strict, StrictConverter } from 'nabu';
import { concat, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';

import { cache } from '../data/cache';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { mapNonNull } from '../rxjs/map-non-null';
import { ArrayDiff, diffArray } from '../rxjs/state/array-diff';
import { WebStorageObservable } from '../rxjs/web-storage-observable';
import { listConverter } from '../serializer/list-converter';

import { EditableStorage } from './editable-storage';


export const INDEXES_PARSER = listConverter<string>(identity<string>());

export class WebStorage<T> implements EditableStorage<T> {
  private readonly converter: StrictConverter<T, string>;
  private readonly idGenerator: BaseIdGenerator = new SimpleIdGenerator();
  private readonly indexesConverter: StrictConverter<string[], string>;
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
            switchMap(ids => {
              const newArray = ids.filter(v => v !== id);
              const result = this.indexesConverter.convertForward(newArray);
              return concat(
                  this.storage.setItem(this.prefix, result),
                  this.storage.removeItem(getPath(id, this.prefix)),
              );
            }),
        );
  }

  deleteAt(index: number): Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  findIndex(id: string): Observable<number|null> {
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
            switchMap(ids => {
              const newIds = this.indexesConverter.convertForward(
                  [...new Set([...ids, id])],
              );
              const itemResult = this.converter.convertForward(instance);

              return concat(
                  this.storage.setItem(this.prefix, newIds),
                  this.storage.setItem(path, itemResult),
              );
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
                return [];
              }

              return this.indexesConverter.convertBackward(indexesStr);
            }),
            shareReplay(1),
        );
  }
}

function getPath(key: string, prefix: string): string {
  return `${prefix}/${key}`;
}
