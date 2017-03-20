import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ArrayIterable } from '../collection/array-iterable';
import { GeneratorIterable } from '../collection/generator-iterable';
import { Iterables } from '../collection/iterables';
import { Mappables } from '../collection/mappables';
import { Fakes } from '../mock/fakes';


describe('collection.Mappables', () => {
  describe('addAll', () => {
    it('should append all the given elements in the current mappable', () => {
      const iterable = ArrayIterable.newInstance(<[string, number][]> [['c', 3], ['d', 4]]);
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const result = {};
      Mappables.of<string, number>(map)
          .addAll(iterable)
          .iterate((entry: [string, number]) => {
            result[entry[0]] = entry[1];
          });
      assert(result).to.equal({
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
      });
    });

    it('should work with infinite iterable', () => {
      const infiniteIterable = GeneratorIterable.newInstance<[string, number]>(() => {
        return {done: false, value: ['a', 0]};
      });
      Mappables.of(new Map()).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should append all the given elements in the current mappable', () => {
      const array = <[string, number][]> [['c', 3], ['d', 4]];
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const result = Mappables.of<string, number>(map)
          .addAllArray(array)
          .asRecord();
      assert(result).to.equal({
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
      });
    });
  });

  describe('addAllMap', () => {
    it('should append all the given elements in the map in the current mappable', () => {
      const addedMap = new Map<string, number>(<[string, number][]> [['c', 3], ['d', 4]]);
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const result = Mappables.of<string, number>(map)
          .addAllMap(addedMap)
          .asRecord();
      assert(result).to.equal({
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
      });
    });
  });

  describe('all', () => {
     it('should return true if all the entries passes the check function', () => {
       const checkFn = jasmine.createSpy('CheckFn');
       checkFn.and.returnValue(true);

       const map = new Map<string, number>(<[string, number][]> [
         ['a', 1],
         ['b', 2],
         ['c', 3],
       ]);

       assert(Mappables.of(map).all(checkFn)).to.beTrue();
       assert(checkFn).to.haveBeenCalledWith(1, 'a');
       assert(checkFn).to.haveBeenCalledWith(2, 'b');
       assert(checkFn).to.haveBeenCalledWith(3, 'c');
     });

     it('should return false if one of the entries does not pass the check function', () => {
       const checkFn = Fakes.build(jasmine.createSpy('CheckFn')).call((value: number) => {
         return value <= 2;
       });

       const map = new Map<string, number>(<[string, number][]> [
         ['a', 1],
         ['b', 2],
         ['c', 3],
         ['d', 4],
       ]);

       assert(Mappables.of(map).all(checkFn)).to.beFalse();
       assert(checkFn).to.haveBeenCalledWith(1, 'a');
       assert(checkFn).to.haveBeenCalledWith(2, 'b');
       assert(checkFn).to.haveBeenCalledWith(3, 'c');
       assert(checkFn).toNot.haveBeenCalledWith(4, 'd');
     });
  });

  describe('anyEntry', () => {
    it('should return an entry in the map', () => {
      const map = new Map([[1, 'a'], [2, 'b']]);
      const [key, value] = Mappables.of(map).anyEntry()!;
      assert(map.get(key)).to.equal(value);
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const iterable = Mappables.of(map).asIterable();
      const result = {};
      Iterables.of(iterable).iterate((entry: [string, number]) => {
        result[entry[0]] = entry[1];
      });
      assert(result).to.equal({'a': 1, 'b': 2});
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the mappable', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const iterator = Mappables.of(map).asIterator();
      const resultRecord = {};

      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        resultRecord[result.value[0]] = result.value[1];
      }
      assert(resultRecord).to.equal({'a': 1, 'b': 2});
    });
  });

  describe('asMap', () => {
    it('should return the correct map', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const resultMap = Mappables.of(map).asMap();
      const resultRecord = {};

      resultMap.forEach((value: number, key: string) => {
        resultRecord[key] = value;
      });

      assert(resultRecord).to.equal({'a': 1, 'b': 2});
    });
  });

  describe('asRecord', () => {
    it('should return the correct record', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const resultRecord = Mappables.of(map).asRecord((key: string) => {
        return key + '$';
      });

      assert(resultRecord).to.equal({'a$': 1, 'b$': 2});
    });

    it('should use the default string function if not specified', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      const resultRecord = Mappables.of(map).asRecord();

      assert(resultRecord).to.equal({'a': 1, 'b': 2});
    });
  });

  describe('filter', () => {
    it('should filter the mappable using the given filter function', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['c', 1], ['c', 3]]);
      const record = Mappables.of(map)
          .filter((entry: [string, number]) => {
            return entry[1] !== 1 && entry[0] !== 'a';
          })
          .asRecord();
      assert(record).to.equal({'c': 3});
    });
  });

  describe('filterEntry', () => {
    it('should filter the mappable using the given filter function', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['c', 1], ['c', 3]]);
      const record = Mappables.of(map)
          .filterEntry((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          })
          .asRecord();
      assert(record).to.equal({'c': 3});
    });
  });

  describe('findEntry', () => {
    it('should find the first entry that matches the given filter function', () => {
      const map = new Map<string, number>(<[string, number][]> [
        ['a', 1],
        ['c', 1],
        ['c', 3],
        ['d', 4],
      ]);
      const entry = Mappables.of(map)
          .findEntry((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          });
      assert(entry).to.equal(['c', 3]);
    });
  });

  describe('findKey', () => {
    it('should find the first entry\'s key that matches the given filter function', () => {
      const map = new Map<string, number>(<[string, number][]> [
        ['a', 1],
        ['c', 1],
        ['c', 3],
        ['d', 4],
      ]);
      const key = Mappables.of(map)
          .findKey((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          });
      assert(key).to.equal('c');
    });
  });

  describe('findValue', () => {
    it('should find the first entry\'s value that matches the given filter function', () => {
      const map = new Map<string, number>(<[string, number][]> [
        ['a', 1],
        ['c', 1],
        ['c', 3],
        ['d', 4],
      ]);
      const value = Mappables.of(map)
          .findValue((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          });
      assert(value).to.equal(3);
    });
  });

  describe('forEach', () => {
    it('should call the callback for every entry in the map', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const callback = jasmine.createSpy('Callback');

      Mappables.of(map).forEach(callback);
      assert(callback).to.haveBeenCalledWith(1, 'a');
      assert(callback).to.haveBeenCalledWith(2, 'b');
      assert(callback).to.haveBeenCalledWith(3, 'c');
    });
  });

  describe('forOf', () => {
    it('should call the callback for all the elements', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const callback = jasmine.createSpy('Callback');

      Mappables.of(map).forOf(callback);
      assert(callback).to.haveBeenCalledWith(1, 'a', Matchers.any(Function));
      assert(callback).to.haveBeenCalledWith(2, 'b', Matchers.any(Function));
      assert(callback).to.haveBeenCalledWith(3, 'c', Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const callback = Fakes.build(jasmine.createSpy('Callback'))
          .call((value: number, key: string, breakFn: () => void) => {
            if (key === 'b') {
              breakFn();
            }
          });

      Mappables.of(map).forOf(callback);
      assert(callback).to.haveBeenCalledWith(1, 'a', Matchers.any(Function));
      assert(callback).to.haveBeenCalledWith(2, 'b', Matchers.any(Function));
      assert(callback).toNot.haveBeenCalledWith(3, 'c', Matchers.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through for all the elements', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const callback = jasmine.createSpy('Callback');

      Mappables.of(map).iterate(callback);
      assert(callback).to.haveBeenCalledWith(['a', 1], Matchers.any(Function));
      assert(callback).to.haveBeenCalledWith(['b', 2], Matchers.any(Function));
      assert(callback).to.haveBeenCalledWith(['c', 3], Matchers.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const callback = Fakes.build(jasmine.createSpy('Callback'))
          .call((entry: [string, number], breakFn: () => void) => {
            if (entry[0] === 'b') {
              breakFn();
            }
          });

      Mappables.of(map).iterate(callback);
      assert(callback).to.haveBeenCalledWith(['a', 1], Matchers.any(Function));
      assert(callback).to.haveBeenCalledWith(['b', 2], Matchers.any(Function));
      assert(callback).toNot.haveBeenCalledWith(['c', 3], Matchers.any(Function));
    });
  });

  describe('keys', () => {
    it('should return the correct set of keys', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      assert(Mappables.of(map).keys().asArray()).to.equal(['a', 'b', 'c']);
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the mappable', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const result = Mappables.of(map)
          .map((entry: [string, number]) => {
            return [
              entry[0] + '$',
              entry[1] + 1,
            ];
          })
          .asRecord();
      assert(result).to.equal({'a$': 2, 'b$': 3, 'c$': 4});
    });
  });

  describe('mapKey', () => {
    it('should apply the mapping function to the mappable', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const result = Mappables.of(map)
          .mapKey((value: number, key: string) => {
            return key + value;
          })
          .asRecord();
      assert(result).to.equal({'a1': 1, 'b2': 2, 'c3': 3});
    });
  });

  describe('mapValue', () => {
    it('should apply the mapping function to the mappable', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const result = Mappables.of(map)
          .mapValue<string>((value: number, key: string) => {
            return key + value;
          })
          .asRecord();
      assert(result).to.equal({'a': 'a1', 'b': 'b2', 'c': 'c3'});
    });
  });

  describe('removeAllKeys', () => {
    it('should remove all entries with keys in the given set', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      const result = Mappables.of(map)
          .removeAllKeys(new Set<string>(['a', 'c']))
          .asRecord();
      assert(result).to.equal({'b': 2});
    });
  });

  describe('some', () => {
    it('should return true if one of the entries passes the check function', () => {
       const checkFn = Fakes.build(jasmine.createSpy('CheckFn')).call((value: number) => {
         return value >= 3;
       });

       const map = new Map<string, number>(<[string, number][]> [
         ['a', 1],
         ['b', 2],
         ['c', 3],
         ['d', 4],
       ]);

       assert(Mappables.of(map).some(checkFn)).to.beTrue();
       assert(checkFn).to.haveBeenCalledWith(1, 'a');
       assert(checkFn).to.haveBeenCalledWith(2, 'b');
       assert(checkFn).to.haveBeenCalledWith(3, 'c');
       assert(checkFn).toNot.haveBeenCalledWith(4, 'd');
      });

    it('should return false if none of the entries passes the check function', () => {
       const checkFn = jasmine.createSpy('CheckFn');
       checkFn.and.returnValue(false);

       const map = new Map<string, number>(<[string, number][]> [
         ['a', 1],
         ['b', 2],
         ['c', 3],
       ]);

       assert(Mappables.of(map).some(checkFn)).to.beFalse();
       assert(checkFn).to.haveBeenCalledWith(1, 'a');
       assert(checkFn).to.haveBeenCalledWith(2, 'b');
       assert(checkFn).to.haveBeenCalledWith(3, 'c');
    });
  });

  describe('values', () => {
    it('should return the correct set of values', () => {
      const map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      assert(Mappables.of(map).values().asArray()).to.equal([1, 2, 3]);
    });
  });

  describe('group', () => {
    it('should create the correct grouped map', () => {
      const entries: [string, number][] = [
        ['a', 1],
        ['b', 2],
        ['a', 2],
        ['c', 3],
      ];
      assert(Mappables.group<string, number>(entries).asMap()).to
          .haveEntries(<[string, number[]][]> [
            ['a', [1, 2]],
            ['b', [2]],
            ['c', [3]],
          ]);
    });
  });
});
