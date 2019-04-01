import { binary } from '@nabu/grammar';
import { Converter, Serializable } from '@nabu/main';
import { compose, identity, strict, StrictConverter } from '@nabu/util';
import { Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { createImmutableSet, ImmutableSet } from '../collect/types/immutable-set';
import { cache } from '../data/cache';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { diffSet } from '../rxjs/diff-set';
import { mapNonNull } from '../rxjs/map-non-null';
import { SetDiff } from '../rxjs/set-observable';
import { WebStorageObservable } from '../rxjs/web-storage-observable';
import { setConverter } from '../serializer/set-converter';
import { EditableStorage } from './editable-storage';

export const INDEXES_PARSER = setConverter<string>(identity<string>());

export class WebStorage<T> implements EditableStorage<T> {
  private readonly storage: WebStorageObservable;
  private readonly converter: StrictConverter<T, string>;
  private readonly idGenerator_: BaseIdGenerator = new SimpleIdGenerator();
  private readonly indexesConverter: StrictConverter<ImmutableSet<string>, string>;

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

  @cache()
  private listIdsAsSet(): Observable<Set<string>> {
    return this.storage.getItem(this.prefix)
        .pipe(
            map(indexesStr => {
              if (!indexesStr) {
                return createImmutableSet<string>();
              }

              return this.indexesConverter.convertBackward(indexesStr);
            }),
            map(immutableSet => new Set(immutableSet)),
            shareReplay(1),
        );
  }

  delete(id: string): Observable<unknown> {
    return this.listIdsAsSet()
        .pipe(
            take(1),
            tap(ids => {
              const newSet = new Set(ids);
              newSet.delete(id);
              const result = this.indexesConverter.convertForward(createImmutableSet(newSet));
              this.storage.setItem(this.prefix, result);
              this.storage.removeItem(getPath(id, this.prefix));
            })
        );
  }

  generateId(): Observable<string> {
    return this.listIdsAsSet()
        .pipe(
            map(ids => this.idGenerator_.generate(ids)),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.listIdsAsSet()
        .pipe(
            map(ids => ids.has(id)),
            shareReplay(1),
        );
  }

  listIds(): Observable<SetDiff<string>> {
    return this.listIdsAsSet().pipe(diffSet());
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
    return this.listIdsAsSet()
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
}

function getPath(key: string, prefix: string): string {
  return `${prefix}/${key}`;
}
