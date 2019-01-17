import { assert, should, test } from 'gs-testing/export/main';
import { binary } from 'nabu/export/grammar';
import { compose, identity, strict } from 'nabu/export/util';
import { BehaviorSubject } from 'rxjs';
import { ImmutableSet } from '../collect/immutable-set';
import { integerConverter } from '../serializer/integer-converter';
import { INDEXES_PARSER, WebStorage } from './web-storage';

function setStorage(storage: Storage, key: string, value: string): void {
  storage.setItem(key, value);
  window.dispatchEvent(new StorageEvent('storage'));
}

test('store.WebStorage', () => {
  const PREFIX = 'store.WebStorage.prefix';
  const INDEXES_BINARY_CONVERTER = strict(compose(INDEXES_PARSER, binary()));
  const ITEM_BINARY_CONVERTER = strict(compose(integerConverter(), binary()));
  let storage: WebStorage<number>;

  beforeEach(() => {
    localStorage.clear();
    storage = new WebStorage(localStorage, PREFIX, identity<number>());
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('delete', () => {
    should('remove the correct object', () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;
      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward(ImmutableSet.of([id])),
      );
      setStorage(localStorage, path, ITEM_BINARY_CONVERTER.convertForward(123));

      const idsSubject = new BehaviorSubject(ImmutableSet.of<string>());
      storage.listIds().subscribe(idsSubject);

      const itemSubject = new BehaviorSubject<number|null>(null);
      storage.read(id).subscribe(itemSubject);

      storage.delete(id);

      assert(localStorage.getItem(path)).to.beNull();
      assert(localStorage.getItem(PREFIX)).to
          .equal(INDEXES_BINARY_CONVERTER.convertForward(ImmutableSet.of([])));
      assert(idsSubject.getValue()).to.beEmpty();
      assert(itemSubject.getValue()).to.beNull();
    });
  });

  test('has', () => {
    should('resolve with true if the object is in the storage', () => {
      const id = 'id';

      const hasSubject = new BehaviorSubject<boolean|null>(null);
      storage.has(id).subscribe(hasSubject);

      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward(ImmutableSet.of([id])),
      );

      assert(hasSubject.getValue()).to.beTrue();
    });

    should('resolve with false if the object is in the storage', () => {
      const id = 'id';

      const hasSubject = new BehaviorSubject<boolean|null>(null);
      storage.has(id).subscribe(hasSubject);

      assert(hasSubject.getValue()).to.beFalse();
    });
  });

  test('listIds', () => {
    should('return the indexes', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';

      const idsSubject = new BehaviorSubject<ImmutableSet<string>>(ImmutableSet.of());
      storage.listIds().subscribe(idsSubject);

      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward(ImmutableSet.of([id1, id2, id3])),
      );

      assert(idsSubject.getValue()).to.haveElements([id1, id2, id3]);
    });
  });

  test('read', () => {
    should('resolve with the object', () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;

      const itemSubject = new BehaviorSubject<number|null>(null);
      storage.read(id).subscribe(itemSubject);

      setStorage(localStorage, path, ITEM_BINARY_CONVERTER.convertForward(123));

      assert(itemSubject.getValue()).to.equal(123);
    });

    should('resolve with null if the object does not exist', () => {
      const itemSubject = new BehaviorSubject<number|null>(null);
      storage.read('id').subscribe(itemSubject);
      assert(itemSubject.getValue()).to.beNull();
    });
  });

  test('update', () => {
    should('store the correct object in the storage', () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;
      const oldId = 'oldId';

      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward(ImmutableSet.of(['oldId'])),
      );

      const idsSubject = new BehaviorSubject(ImmutableSet.of<string>());
      storage.listIds().subscribe(idsSubject);

      const itemSubject = new BehaviorSubject<number|null>(null);
      storage.read(id).subscribe(itemSubject);

      storage.update(id, 123);
      assert(idsSubject.getValue()).to.haveElements([oldId, id]);
      assert(itemSubject.getValue()).to.equal(123);
      assert(localStorage.getItem(path)).to.equal(ITEM_BINARY_CONVERTER.convertForward(123));
    });
  });
});
