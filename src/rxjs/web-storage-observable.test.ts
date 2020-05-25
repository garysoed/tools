import { assert, run, should, test } from 'gs-testing';

import { WebStorageObservable } from './web-storage-observable';

interface Entry {
  key: string;
  value: string;
}

class FakeStorage implements Storage {
  constructor(readonly data: Entry[]) { }

  get length(): number {
    return this.data.length;
  }

  [name: string]: any;

  clear(): void {
    this.data.splice(0, this.data.length);
  }

  getItem(itemKey: string): string|null {
    const entry = this.data.find(({key}) => key === itemKey);

    return entry ? entry.value : null;
  }

  key(index: number): string|null {
    const entry = this.data[index];

    return entry ? entry.key : null;
  }

  removeItem(itemKey: string): void {
    const index = this.data.findIndex(({key}) => key === itemKey);
    this.data.splice(index, 1);
  }

  setItem(itemKey: string, value: string): void {
    const index = this.data.findIndex(({key}) => key === itemKey);
    this.data[index] = {key: itemKey, value};
  }
}

test('gs-tools.rxjs.WebStorageObservable', init => {
  const _ = init(() => {
    const entries = [
      {key: 'key1', value: 'value1'},
      {key: 'key2', value: 'value2'},
      {key: 'key3', value: 'value3'},
    ];
    const obs = new WebStorageObservable(new FakeStorage(entries));
    return {obs, entries};
  });

  test('getLength', () => {
    should(`emit the lengths correctly`, () => {
      const lengthObs = _.obs.getLength();
      assert(lengthObs).to.emitWith(3);

      _.entries.splice(0, 1);
      window.dispatchEvent(new CustomEvent('storage'));

      assert(lengthObs).to.emitWith(2);
    });
  });

  test('getItem', () => {
    should(`emit the items correctly`, () => {
      const item$ = _.obs.getItem('key3');
      assert(item$).to.emitWith('value3');

      _.entries.splice(2, 1);
      window.dispatchEvent(new CustomEvent('storage'));

      assert(item$).to.emitWith(null);
    });
  });

  test('key', () => {
    should(`emit the keys correctly`, () => {
      const keyObs = _.obs.key(2);
      assert(keyObs).to.emitWith('key3');

      _.entries.splice(2, 1);
      window.dispatchEvent(new CustomEvent('storage'));

      assert(keyObs).to.emitWith(null);
    });
  });

  test('removeItem', () => {
    should(`remove the items correctly`, () => {
      const key$ = _.obs.key(2);

      run(_.obs.removeItem('key3'));

      assert(key$).to.emitWith(null);
    });
  });

  test('setItem', () => {
    should(`set the item correctly`, () => {
      const item$ = _.obs.getItem('key3');

      run(_.obs.setItem('key3', 'newValue'));

      assert(item$).to.emitWith('newValue');
    });
  });
});
