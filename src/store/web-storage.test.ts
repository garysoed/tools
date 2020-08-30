import { arrayThat, assert, createSpySubject, run, should, teardown, test } from 'gs-testing';
import { binary, compose, identity, strict } from 'nabu';
import { Subject } from 'rxjs';

import { scanArray } from '../rxjs/state/array-diff';
import { integerConverter } from '../serializer/integer-converter';

import { INDEXES_PARSER, WebStorage } from './web-storage';


function setStorage(storage: Storage, key: string, value: string): void {
  storage.setItem(key, value);
  window.dispatchEvent(new StorageEvent('storage'));
}

test('store.WebStorage', init => {
  const PREFIX = 'store.WebStorage.prefix';
  const INDEXES_BINARY_CONVERTER = strict(compose(INDEXES_PARSER, binary()));
  const ITEM_BINARY_CONVERTER = strict(compose(integerConverter(), binary()));

  const _ = init(() => {
    const onTestDone$ = new Subject<void>();
    localStorage.clear();
    const storage = new WebStorage(localStorage, PREFIX, identity<number>(), binary());
    return {storage, onTestDone$};
  });

  teardown(() => {
    localStorage.clear();
    _.onTestDone$.next();
    _.onTestDone$.complete();
  });

  test('delete', () => {
    should('remove the correct object', () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;
      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward([id]),
      );
      setStorage(localStorage, path, ITEM_BINARY_CONVERTER.convertForward(123));

      const listIds$ = _.storage.listIds()
          .pipe(scanArray());
      const idsSubject = createSpySubject(listIds$);
      const itemSubject = createSpySubject(_.storage.read(id));

      run(_.storage.delete(id));

      assert(localStorage.getItem(path)).to.beNull();
      assert(localStorage.getItem(PREFIX)).to
          .equal(INDEXES_BINARY_CONVERTER.convertForward([]));
      assert(idsSubject).to.emitWith(arrayThat<string>().beEmpty());
      assert(itemSubject).to.emitWith(null);
    });
  });

  test('has', () => {
    should('resolve with true if the object is in the storage', () => {
      const id = 'id';

      const hasSubject = createSpySubject(_.storage.has(id));

      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward([id]),
      );

      assert(hasSubject).to.emitWith(true);
    });

    should('resolve with false if the object is in the storage', () => {
      const id = 'id';

      const hasSubject = createSpySubject(_.storage.has(id));

      assert(hasSubject).to.emitWith(false);
    });
  });

  test('listIds', () => {
    should('return the indexes', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';

      const listIds$ = _.storage.listIds().pipe(scanArray());
      const idsSubject = createSpySubject(listIds$);

      setStorage(
          localStorage,
          PREFIX,
          INDEXES_BINARY_CONVERTER.convertForward([id1, id2, id3]),
      );

      assert(idsSubject).to.emitWith(arrayThat<string>().haveExactElements([id1, id2, id3]));
    });
  });

  test('read', () => {
    should('resolve with the object', () => {
      const id = 'id';
      const path = `${PREFIX}/${id}`;

      const itemSubject = createSpySubject(_.storage.read(id));

      setStorage(localStorage, path, ITEM_BINARY_CONVERTER.convertForward(123));

      assert(itemSubject).to.emitWith(123);
    });

    should('resolve with null if the object does not exist', () => {
      const itemSubject = createSpySubject(_.storage.read('id'));
      assert(itemSubject).to.emitWith(null);
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
          INDEXES_BINARY_CONVERTER.convertForward(['oldId']),
      );

      const listIds$ = _.storage.listIds().pipe(scanArray());
      const idsSubject = createSpySubject(listIds$);

      const itemSubject = createSpySubject(_.storage.read(id));

      run(_.storage.update(id, 123));
      assert(idsSubject).to.emitWith(arrayThat<string>().haveExactElements([oldId, id]));
      assert(itemSubject).to.emitWith(123);
      assert(localStorage.getItem(path)).to.equal(ITEM_BINARY_CONVERTER.convertForward(123));
    });
  });
});
