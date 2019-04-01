import { should, test, assert } from '@gs-testing/main';
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

test('gs-tools.rxjs.WebStorageObservable', () => {
  let entries: Entry[];
  let obs: WebStorageObservable;

  beforeEach(() => {
    entries = [
      {key: 'key1', value: 'value1'},
      {key: 'key2', value: 'value2'},
      {key: 'key3', value: 'value3'},
    ];
    obs = new WebStorageObservable(new FakeStorage(entries));
  });

  test('getLength', () => {
    should(`emit the lengths correctly`, async () => {
      const lengthObs = obs.getLength();
      await assert(lengthObs).to.emitWith(3);

      entries.splice(0, 1);
      window.dispatchEvent(new CustomEvent('storage'));

      await assert(lengthObs).to.emitWith(2);
    });
  });

  test('getItem', () => {
    should(`emit the items correctly`, async () => {
      const itemObs = obs.getItem('key3');
      await assert(itemObs).to.emitWith('value3');

      entries.splice(2, 1);
      window.dispatchEvent(new CustomEvent('storage'));

      await assert(itemObs).to.emitWith(null);
    });
  });

  test('key', () => {
    should(`emit the keys correctly`, async () => {
      const keyObs = obs.key(2);
      await assert(keyObs).to.emitWith('key3');

      entries.splice(2, 1);
      window.dispatchEvent(new CustomEvent('storage'));

      await assert(keyObs).to.emitWith(null);
    });
  });

  test('removeItem', () => {
    should(`remove the items correctly`, async () => {
      const keyObs = obs.key(2);

      obs.removeItem('key3');

      await assert(keyObs).to.emitWith(null);
    });
  });

  test('setItem', () => {
    should(`set the item correctly`, async () => {
      const itemObs = obs.getItem('key3');

      obs.setItem('key3', 'newValue');

      await assert(itemObs).to.emitWith('newValue');
    });
  });
});
