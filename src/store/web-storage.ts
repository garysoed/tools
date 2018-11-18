import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay, startWith, take } from 'rxjs/operators';
import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../parse/parser';
import { SetParser } from '../parse/set-parser';
import { StringParser } from '../parse/string-parser';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { EditableStorage } from './editable-storage';

export const INDEXES_PARSER = SetParser(StringParser);

export class WebStorage<T> implements EditableStorage<T> {
  private readonly idGenerator_: BaseIdGenerator;
  private readonly storageIdsObs_: Observable<ImmutableSet<string>>;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
      private readonly storage_: Storage,
      private readonly prefix_: string,
      private readonly parser_: Parser<T>) {
    this.storageIdsObs_ = createStorageIdsObs_(storage_, prefix_);
    this.idGenerator_ = new SimpleIdGenerator();
  }

  delete(id: string): void {
    this.storageIdsObs_
        .pipe(take(1))
        .subscribe(ids => {
          this.storage_.setItem(this.prefix_, INDEXES_PARSER.convertForward(ids.delete(id)) || '');
        });
  }

  generateId(): Observable<string> {
    return this.storageIdsObs_
        .pipe(
            map(ids => this.idGenerator_.generate(ids)),
            shareReplay(1),
        );
  }

  has(id: string): Observable<boolean> {
    return this.storageIdsObs_
        .pipe(
            map(ids => ids.has(id)),
            shareReplay(1),
        );
  }

  listIds(): Observable<ImmutableSet<string>> {
    return this.storageIdsObs_;
  }

  read(id: string): Observable<T|null> {
    return createStorageObs_(this.storage_, id, this.prefix_, this.parser_);
  }

  update(id: string, instance: T): void {
    const path = getPath_(id, this.prefix_);
    this.listIds()
        .pipe(take(1))
        .subscribe(indexes => {
          this.storage_.setItem(
              this.prefix_,
              INDEXES_PARSER.convertForward(indexes.add(id)) || '',
          );

          this.storage_.setItem(path, this.parser_.convertForward(instance) || '');
        });
  }
}

function createStorageIdsObs_(
    storage: Storage,
    prefix: string,
): Observable<ImmutableSet<string>> {
  return fromEvent(window, 'storage')
      .pipe(
          map(() => getIndexes_(storage, prefix)),
          startWith(getIndexes_(storage, prefix)),
          shareReplay(1),
      );
}

function createStorageObs_<T>(
    storage: Storage,
    id: string,
    prefix: string,
    parser: Parser<T>,
): Observable<T|null> {
  return fromEvent(window, 'storage')
      .pipe(
          map(() => getItem_(storage, id, prefix, parser)),
          startWith(getItem_(storage, id, prefix, parser)),
          shareReplay(1),
      );
}

function getIndexes_(storage: Storage, prefix: string): ImmutableSet<string> {
  const set = INDEXES_PARSER.convertBackward(storage.getItem(prefix)) || ImmutableSet.of([]);

  return set.filterItem((id): id is string => !!id);
}

function getItem_<T>(storage: Storage, id: string, prefix: string, parser: Parser<T>): T|null {
  return parser.convertBackward(storage.getItem(getPath_(id, prefix)));
}

function getPath_(key: string, prefix: string): string {
  return `${prefix}/${key}`;
}
