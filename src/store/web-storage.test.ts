import {assert, createSpySubject, setThat, setup, should, teardown, test} from 'gs-testing';
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
    should('delete all the items', () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      _.storage.update(id1, 1);
      _.storage.update(id2, 2);
      _.storage.update(id3, 3);
      _.storage.clear();

      assert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
      assert(localStorage.getItem(PREFIX)).to.beNull();
      assert(localStorage.getItem(`${PREFIX}/${id1}`)).to.beNull();
      assert(localStorage.getItem(`${PREFIX}/${id2}`)).to.beNull();
      assert(localStorage.getItem(`${PREFIX}/${id3}`)).to.beNull();
    });
  });


  test('delete', () => {
    should('delete the specified item', () => {
      const id = 'id';
      _.storage.update(id, 1);

      assert(_.storage.delete(id)).to.beTrue();
      assert(_.storage.idList$).to.emitWith(setThat<string>().beEmpty());
      assert(localStorage.getItem(PREFIX)).to.equal('[]');
      assert(localStorage.getItem(`${PREFIX}/${id}`)).to.beNull();
    });

    should('return false if the specified item doesn\'t exist', () => {
      assert(_.storage.delete('non existent')).to.beFalse();
    });
  });

  test('has', () => {
    should('emit true if the object with the ID exists', () => {
      const id = 'id';
      _.storage.update(id, 1);

      assert(_.storage.has(id)).to.emitWith(true);
    });

    should('emit false if the object with the ID doesn\'t exist', () => {
      assert(_.storage.has('non existent')).to.emitWith(false);
    });

    should('respond to changes in the storage', () => {
      const id = 'id';

      const has$ = createSpySubject(_.storage.has(id));
      setStorage(localStorage, PREFIX, `["${id}"]`);

      assert(has$).to.emitSequence([false, true]);
    });
  });

  test('idList$', () => {
    should('emit all the IDs in the storage', () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';
      _.storage.update(id1, 1);
      _.storage.update(id2, 2);
      _.storage.update(id3, 3);

      assert(_.storage.idList$).to
          .emitWith(setThat<string>().haveExactElements(new Set([id1, id2, id3])));
    });

    should('respond to changes in the storage', () => {
      const id1 = 'id1';
      const id2 = 'id2';
      const id3 = 'id3';

      const ids$ = createSpySubject(_.storage.idList$);
      setStorage(localStorage, PREFIX, `["${id1}"]`);
      setStorage(localStorage, PREFIX, `["${id1}","${id2}"]`);
      setStorage(localStorage, PREFIX, `["${id1}","${id2}","${id3}"]`);

      assert(ids$).to.emitSequence([
        setThat<string>().haveExactElements(new Set([])),
        setThat<string>().haveExactElements(new Set([id1])),
        setThat<string>().haveExactElements(new Set([id1, id2])),
        setThat<string>().haveExactElements(new Set([id1, id2, id3])),
      ]);
    });
  });

  test('read', () => {
    should('return the object corresponding to the item', () => {
      const value = 123;
      const id = 'id';
      _.storage.update(id, value);

      assert(_.storage.read(id)).to.emitWith(value);
    });

    should('return undefined if the object doesn\'t exist', () => {
      assert(_.storage.read('non existent')).to.emitWith(undefined);
    });

    should('respond to changes in the storage', () => {
      const id = 'id';
      const value = 123;

      const value$ = createSpySubject(_.storage.read(id));
      setStorage(localStorage, PREFIX, `["${id}"]`);
      setStorage(localStorage, `${PREFIX}/${id}`, `${value}`);

      assert(value$).to.emitSequence([undefined, undefined, value]);
    });
  });

  test('update', () => {
    should('update the object corresponding to the ID', () => {
      const value = 123;
      const id = 'id';
      _.storage.update(id, value);

      const value2 = 345;

      assert(_.storage.update(id, value2)).to.beTrue();
      assert(_.storage.read(id)).to.emitWith(value2);
      assert(localStorage.getItem(PREFIX)).to.equal(`["${id}"]`);
      assert(localStorage.getItem(`${PREFIX}/${id}`)).to.equal(`${value2}`);
    });

    should('return false if the object for the ID doesn\'t exist', () => {
      const value = 123;
      const id = 'id';

      assert(_.storage.update(id, value)).to.beFalse();
      assert(_.storage.read(id)).to.emitWith(value);
      assert(localStorage.getItem(PREFIX)).to.equal(`["${id}"]`);
      assert(localStorage.getItem(`${PREFIX}/${id}`)).to.equal(`${value}`);
    });
  });
});
