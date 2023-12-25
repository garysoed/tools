import {assert, asyncAssert, createSpySubject, setThat, setup, should, teardown, test} from 'gs-testing';
import {identity, json} from 'nabu';

import {WebStorage} from './web-storage';


function setStorage(storage: Storage, key: string, value: string): void {
  storage.setItem(key, value);
  window.dispatchEvent(new StorageEvent('storage'));
}

test('@tools/store/web-storage', () => {
  const PREFIX = 'store.WebStorage.prefix';

  const _ = setup(() => {
    localStorage.clear();
    const storage = new WebStorage(
        localStorage,
        PREFIX,
        identity<number>(),
        json(),
    );
    return {storage};
  });

  teardown(() => {
    localStorage.clear();
  });

  test('clear', () => {
    should('delete all the items', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      _.storage.update(id1, 1);
      _.storage.update(id2, 2);
      _.storage.update(id3, 3);
      _.storage.clear();

      await asyncAssert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
      assert(localStorage.getItem(PREFIX)).to.beNull();
      assert(localStorage.getItem(`${PREFIX}/${id1}`)).to.beNull();
      assert(localStorage.getItem(`${PREFIX}/${id2}`)).to.beNull();
      assert(localStorage.getItem(`${PREFIX}/${id3}`)).to.beNull();
    });
  });


  test('delete', () => {
    should('delete the specified item', async () => {
      const id = 'id';
      _.storage.update(id, 1);

      assert(_.storage.delete(id)).to.beTrue();
      await asyncAssert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
      assert(localStorage.getItem(PREFIX)).to.equal('[]');
      assert(localStorage.getItem(`${PREFIX}/${id}`)).to.beNull();
    });

    should('return false if the specified item doesn\'t exist', () => {
      assert(_.storage.delete('non existent')).to.beFalse();
    });
  });

  test('has', () => {
    should('emit true if the object with the ID exists', async () => {
      const id = 'id';
      _.storage.update(id, 1);

      await asyncAssert(_.storage.has(id)).to.emitWith(true);
    });

    should('emit false if the object with the ID doesn\'t exist', async () => {
      await asyncAssert(_.storage.has('non existent')).to.emitWith(false);
    });

    should('respond to changes in the storage', async () => {
      const id = 'id';

      const has$ = createSpySubject(_.storage.has(id));
      setStorage(localStorage, PREFIX, `["${id}"]`);

      await asyncAssert(has$).to.emitSequence([false, true]);
    });
  });

  test('idList$', () => {
    should('emit all the IDs in the storage', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      _.storage.update(id1, 1);
      _.storage.update(id2, 2);
      _.storage.update(id3, 3);

      await asyncAssert(_.storage.idList$).to
          .emitWith(setThat<string>().haveExactElements(new Set([id1, id2, id3])));
    });

    should('respond to changes in the storage', async () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';

      const ids$ = createSpySubject(_.storage.idList$);
      setStorage(localStorage, PREFIX, `["${id1}"]`);
      setStorage(localStorage, PREFIX, `["${id1}","${id2}"]`);
      setStorage(localStorage, PREFIX, `["${id1}","${id2}","${id3}"]`);

      await asyncAssert(ids$).to.emitSequence([
        setThat<string>().haveExactElements(new Set([])),
        setThat<string>().haveExactElements(new Set([id1])),
        setThat<string>().haveExactElements(new Set([id1, id2])),
        setThat<string>().haveExactElements(new Set([id1, id2, id3])),
      ]);
    });
  });

  test('read', () => {
    should('return the object corresponding to the item', async () => {
      const value = 123;
      const id = 'id';
      _.storage.update(id, value);

      await asyncAssert(_.storage.read(id)).to.emitWith(value);
    });

    should('return undefined if the object doesn\'t exist', async () => {
      await asyncAssert(_.storage.read('non existent')).to.emitWith(undefined);
    });

    should('respond to changes in the storage', async () => {
      const id = 'id';
      const value = 123;

      const value$ = createSpySubject(_.storage.read(id));
      setStorage(localStorage, PREFIX, `["${id}"]`);
      setStorage(localStorage, `${PREFIX}/${id}`, `${value}`);

      await asyncAssert(value$).to.emitSequence([undefined, undefined, value]);
    });
  });

  test('update', () => {
    should('update the object corresponding to the ID', async () => {
      const value = 123;
      const id = 'id';
      _.storage.update(id, value);

      const value2 = 345;

      assert(_.storage.update(id, value2)).to.beTrue();
      await asyncAssert(_.storage.read(id)).to.emitWith(value2);
      assert(localStorage.getItem(PREFIX)).to.equal(`["${id}"]`);
      assert(localStorage.getItem(`${PREFIX}/${id}`)).to.equal(`${value2}`);
    });

    should('return false if the object for the ID doesn\'t exist', async () => {
      const value = 123;
      const id = 'id';

      assert(_.storage.update(id, value)).to.beFalse();
      await asyncAssert(_.storage.read(id)).to.emitWith(value);
      assert(localStorage.getItem(PREFIX)).to.equal(`["${id}"]`);
      assert(localStorage.getItem(`${PREFIX}/${id}`)).to.equal(`${value}`);
    });
  });
});
