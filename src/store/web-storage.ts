import { fromEvent, Observable } from 'rxjs';
import { map, shareReplay, startWith, take, tap } from 'rxjs/operators';
import { ImmutableSet } from '../immutable/immutable-set';
import { Parser } from '../parse/parser';
import { SetParser } from '../parse/set-parser';
import { StringParser } from '../parse/string-parser';
import { BaseIdGenerator } from '../random/base-id-generator';
import { SimpleIdGenerator } from '../random/simple-id-generator';
import { EditableStorage } from './editable-storage';
import { Invalidator } from './invalidator';

export const INDEXES_PARSER = SetParser(StringParser);

export class WebStorage<T> implements EditableStorage<T> {
  private readonly idGenerator_: BaseIdGenerator;
  private readonly invalidator_: Invalidator;
  private readonly storageIdsObs_: Observable<ImmutableSet<string>>;

  /**
   * @param storage Reference to storage instance.
   * @param prefix The prefix of the IDs added by this storage.
   */
  constructor(
      private readonly storage_: Storage,
      private readonly prefix_: string,
      private readonly parser_: Parser<T>,
  ) {
    const invalidator = new Invalidator(fromEvent(window, 'storage'));
    this.storageIdsObs_ = createStorageIdsObs_(storage_, prefix_, invalidator.getObservable());
    this.idGenerator_ = new SimpleIdGenerator();
    this.invalidator_ = invalidator;
  }

  delete(id: string): void {
    this.storageIdsObs_
        .pipe(take(1))
        .subscribe(ids => {
          this.storage_.setItem(this.prefix_, INDEXES_PARSER.convertForward(ids.delete(id)) || '');
          this.storage_.removeItem(getPath_(id, this.prefix_));
          this.invalidator_.invalidate();
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
    return this.invalidator_.getObservable()
        .pipe(
            map(() => getItem_(this.storage_, id, this.prefix_, this.parser_)),
            startWith(getItem_(this.storage_, id, this.prefix_, this.parser_)),
            shareReplay(1),
        );
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
          this.invalidator_.invalidate();
        });
  }
}

function createStorageIdsObs_(
    storage: Storage,
    prefix: string,
    invalidatorObs: Observable<unknown>,
): Observable<ImmutableSet<string>> {
  return invalidatorObs
      .pipe(
          map(() => getIndexes_(storage, prefix)),
          startWith(getIndexes_(storage, prefix)),
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
