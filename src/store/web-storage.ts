import { binary } from 'nabu/export/grammar';
import { Converter, Serializable } from 'nabu/export/main';
import { compose, identity, strict, StrictConverter } from 'nabu/export/util';
import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';
import { exec } from '../collect/exec';
import { deleteEntry } from '../collect/operators/delete-entry';
import { filter } from '../collect/operators/filter';
import { hasEntry } from '../collect/operators/has-entry';
import { push } from '../collect/operators/push';
import { asImmutableSet, createImmutableSet, ImmutableSet } from '../collect/types/immutable-set';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { setConverter } from '../serializer/set-converter';
import { EditableStorage } from './editable-storage';
import { Invalidator } from './invalidator';

export const INDEXES_PARSER = setConverter<string>(identity<string>());

export class WebStorage<T> implements EditableStorage<T> {
  private readonly converter_: StrictConverter<T, string>;
  private readonly idGenerator_: BaseIdGenerator = new SimpleIdGenerator();
  private readonly indexesConverter_: StrictConverter<ImmutableSet<string>, string>;
  private readonly invalidator_: Invalidator;
  private readonly storageIdsObs_: Observable<ImmutableSet<string>>;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
      private readonly storage_: Storage,
      private readonly prefix_: string,
      converter: Converter<T, Serializable>,
  ) {
    const invalidator = new Invalidator(fromEvent(window, 'storage'));
    const binaryGrammar = binary();
    this.converter_ = strict(compose(converter, binaryGrammar));
    this.indexesConverter_ = strict(compose(INDEXES_PARSER, binaryGrammar));
    this.storageIdsObs_ = createStorageIdsObs_(
        storage_,
        prefix_,
        invalidator.getObservable(),
        this.indexesConverter_,
    );
    this.invalidator_ = invalidator;
  }

  delete(id: string): void {
    this.storageIdsObs_
        .pipe(take(1))
        .subscribe(ids => {
          const result = this.indexesConverter_.convertForward(
              exec(
                  ids,
                  deleteEntry(id),
                  asImmutableSet(),
              ),
          );
          this.storage_.setItem(this.prefix_, result);
          this.storage_.removeItem(getPath_(id, this.prefix_));
          this.invalidator_.invalidate();
        });
  }

  generateId(): Observable<string> {
    return this.storageIdsObs_
        .pipe(
            map(ids => this.idGenerator_.generate(ids())),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.storageIdsObs_
        .pipe(
            map(ids => exec(ids, hasEntry(id))),
            shareReplay(1),
        );
  }

  listIds(): Observable<ImmutableSet<string>> {
    return this.storageIdsObs_;
  }

  read(id: string): Observable<T|null> {
    return this.invalidator_.getObservable()
        .pipe(
            map(() => getItem_(this.storage_, id, this.prefix_, this.converter_)),
            startWith(getItem_(this.storage_, id, this.prefix_, this.converter_)),
            shareReplay(1),
        );
  }

  update(id: string, instance: T): void {
    const path = getPath_(id, this.prefix_);
    this.listIds()
        .pipe(take(1))
        .subscribe(indexes => {
          const indexesResult = this.indexesConverter_.convertForward(
              exec(indexes, push(id), asImmutableSet()),
          );
          this.storage_.setItem(this.prefix_, indexesResult);

          const itemResult = this.converter_.convertForward(instance);
          this.storage_.setItem(path, itemResult);
          this.invalidator_.invalidate();
        });
  }
}

function createStorageIdsObs_(
    storage: Storage,
    prefix: string,
    invalidatorObs: Observable<unknown>,
    indexesConverter: StrictConverter<ImmutableSet<string>, string>,
): Observable<ImmutableSet<string>> {
  return invalidatorObs
      .pipe(
          map(() => getIndexes_(storage, prefix, indexesConverter)),
          startWith(getIndexes_(storage, prefix, indexesConverter)),
          shareReplay(1),
      );
}

function getIndexes_(
    storage: Storage,
    prefix: string,
    indexesConverter: StrictConverter<ImmutableSet<string>, string>,
): ImmutableSet<string> {
  const indexesStr = storage.getItem(prefix);
  if (!indexesStr) {
    return createImmutableSet();
  }

  const set = indexesConverter.convertBackward(indexesStr);

  return exec(set, filter((id): id is string => !!id), asImmutableSet());
}

function getItem_<T>(
    storage: Storage,
    id: string,
    prefix: string,
    converter: StrictConverter<T, string>): T|null {
  const itemStr = storage.getItem(getPath_(id, prefix));
  if (!itemStr) {
    return null;
  }

  return converter.convertBackward(itemStr);
}

function getPath_(key: string, prefix: string): string {
  return `${prefix}/${key}`;
}
