import { assert, should, test, tupleThat } from 'gs-testing';

import { OrderedMap } from './ordered-map';

test('@tools/collect/ordered-map', () => {
  test('Symbol.iterator', () => {
    should(`iterate the values in order`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert([...map]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['b', 2]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
      ]);
    });
  });

  test('size', () => {
    should(`return the correct size`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.size).to.equal(3);
    });
  });

  test('clear', () => {
    should(`clear the map`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);
      map.clear();

      assert([...map]).to.beEmpty();
    });
  });

  test('delete', () => {
    should(`delete the given key`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.delete('b')).to.beTrue();
      assert([...map]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
      ]);
    });

    should(`return false if the key does not exist`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.delete('d')).to.beFalse();
      assert([...map]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['b', 2]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
      ]);
    });
  });

  test('entries', () => {
    should(`return the entries in order`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert([...map.entries()]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['b', 2]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
      ]);
    });
  });

  test('forEach', () => {
    should(`iterate in order`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);
      let result = '';
      map.forEach((value, key) => {
        result += `${key}:${value}`;
      });

      assert(result).to.equal('a:1b:2c:3');
    });
  });

  test('get', () => {
    should(`return the correct value`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.get('b')).to.equal(2);
    });

    should(`return undefined if the key doesn't exist`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.get('d')).toNot.beDefined();
    });
  });

  test('getAt', () => {
    should(`return the correct entry at the given index`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.getAt(1)).to.equal(tupleThat().haveExactElements(['b', 2]));
    });

    should(`return undefined if the index is out of bound`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.getAt(-1)).toNot.beDefined();
      assert(map.getAt(5)).toNot.beDefined();
    });
  });

  test('has', () => {
    should(`return true if the key exists`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.has('a')).to.beTrue();
    });

    should(`return false if the key doesn't exist`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert(map.has('d')).to.beFalse();
    });
  });

  test('keys', () => {
    should(`return keys in order`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert([...map.keys()]).to.haveExactElements(['a', 'b', 'c']);
    });
  });

  test('set', () => {
    should(`add the new value at the end`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);
      map.set('d', 4);

      assert([...map]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['b', 2]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
        tupleThat<[string, number]>().haveExactElements(['d', 4]),
      ]);
    });

    should(`replace the old value`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);
      map.set('b', 4);

      assert([...map]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['b', 4]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
      ]);
    });
  });

  test('splice', () => {
    should(`add and delete entries correctly`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);
      const deleted = map.splice(1, 1, ['d', 4], ['e', 5]);

      assert(deleted).to
          .haveExactElements([tupleThat<[string, number]>().haveExactElements(['b', 2])]);
      assert([...map]).to.haveExactElements([
        tupleThat<[string, number]>().haveExactElements(['a', 1]),
        tupleThat<[string, number]>().haveExactElements(['d', 4]),
        tupleThat<[string, number]>().haveExactElements(['e', 5]),
        tupleThat<[string, number]>().haveExactElements(['c', 3]),
      ]);
    });
  });

  test('values', () => {
    should(`return the values in order`, () => {
      const map = new OrderedMap([['a', 1], ['b', 2], ['c', 3]]);

      assert([...map.values()]).to.haveExactElements([1, 2, 3]);
    });
  });
});
