import TestBase from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {GeneratorIterable} from './generator-iterable';
import {Iterables} from './iterables';
import {Mappables} from './mappables';


describe('collection.Mappables', () => {
  describe('addAll', () => {
    it('should append all the given elements in the current mappable', () => {
      let iterable = ArrayIterable.newInstance(<[string, number][]> [['c', 3], ['d', 4]]);
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let result = {};
      Mappables.of<string, number>(map)
          .addAll(iterable)
          .iterate((entry: [string, number]) => {
            result[entry[0]] = entry[1];
          });
      expect(result).toEqual({
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
      });
    });

    it('should work with infinite iterable', () => {
      let infiniteIterable = GeneratorIterable.newInstance<[string, number]>(() => {
        return {done: false, value: ['a', 0]};
      });
      Mappables.of(new Map()).addAll(infiniteIterable);
    });
  });

  describe('addAllArray', () => {
    it('should append all the given elements in the current mappable', () => {
      let array = <[string, number][]> [['c', 3], ['d', 4]];
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let result = Mappables.of<string, number>(map)
          .addAllArray(array)
          .asRecord();
      expect(result).toEqual({
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
      });
    });
  });

  describe('addAllMap', () => {
    it('should append all the given elements in the map in the current mappable', () => {
      let addedMap = new Map<string, number>(<[string, number][]> [['c', 3], ['d', 4]]);
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let result = Mappables.of<string, number>(map)
          .addAllMap(addedMap)
          .asRecord();
      expect(result).toEqual({
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
      });
    });
  });

  describe('asIterable', () => {
    it('should return iterable that iterates the content', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let iterable = Mappables.of(map).asIterable();
      let result = {};
      Iterables.of(iterable).iterate((entry: [string, number]) => {
        result[entry[0]] = entry[1];
      });
      expect(result).toEqual({'a': 1, 'b': 2});
    });
  });

  describe('asIterator', () => {
    it('should return iterator instance that iterates the mappable', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let iterator = Mappables.of(map).asIterator();
      let resultRecord = {};

      for (let result = iterator.next(); !result.done; result = iterator.next()) {
        resultRecord[result.value[0]] = result.value[1];
      }
      expect(resultRecord).toEqual({'a': 1, 'b': 2});
    });
  });

  describe('asMap', () => {
    it('should return the correct map', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let resultMap = Mappables.of(map).asMap();
      let resultRecord = {};

      resultMap.forEach((value: number, key: string) => {
        resultRecord[key] = value;
      });

      expect(resultRecord).toEqual({'a': 1, 'b': 2});
    });
  });

  describe('asRecord', () => {
    it('should return the correct record', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let resultRecord = Mappables.of(map).asRecord((key: string) => {
        return key + '$';
      });

      expect(resultRecord).toEqual({'a$': 1, 'b$': 2});
    });

    it('should use the default string function if not specified', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2]]);
      let resultRecord = Mappables.of(map).asRecord();

      expect(resultRecord).toEqual({'a': 1, 'b': 2});
    });
  });

  describe('filter', () => {
    it('should filter the mappable using the given filter function', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['c', 1], ['c', 3]]);
      let record = Mappables.of(map)
          .filter((entry: [string, number]) => {
            return entry[1] !== 1 && entry[0] !== 'a';
          })
          .asRecord();
      expect(record).toEqual({'c': 3});
    });
  });

  describe('filterEntry', () => {
    it('should filter the mappable using the given filter function', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['c', 1], ['c', 3]]);
      let record = Mappables.of(map)
          .filterEntry((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          })
          .asRecord();
      expect(record).toEqual({'c': 3});
    });
  });

  describe('findEntry', () => {
    it('should find the first entry that matches the given filter function', () => {
      let map = new Map<string, number>(<[string, number][]> [
        ['a', 1],
        ['c', 1],
        ['c', 3],
        ['d', 4],
      ]);
      let entry = Mappables.of(map)
          .findEntry((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          });
      expect(entry).toEqual(['c', 3]);
    });
  });

  describe('findKey', () => {
    it('should find the first entry\'s key that matches the given filter function', () => {
      let map = new Map<string, number>(<[string, number][]> [
        ['a', 1],
        ['c', 1],
        ['c', 3],
        ['d', 4],
      ]);
      let key = Mappables.of(map)
          .findKey((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          });
      expect(key).toEqual('c');
    });
  });

  describe('findValue', () => {
    it('should find the first entry\'s value that matches the given filter function', () => {
      let map = new Map<string, number>(<[string, number][]> [
        ['a', 1],
        ['c', 1],
        ['c', 3],
        ['d', 4],
      ]);
      let value = Mappables.of(map)
          .findValue((value: number, key: string) => {
            return value !== 1 && key !== 'a';
          });
      expect(value).toEqual(3);
    });
  });

  describe('forEach', () => {
    it('should call the callback for every entry in the map', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let callback = jasmine.createSpy('Callback');

      Mappables.of(map).forEach(callback);
      expect(callback).toHaveBeenCalledWith(1, 'a');
      expect(callback).toHaveBeenCalledWith(2, 'b');
      expect(callback).toHaveBeenCalledWith(3, 'c');
    });
  });

  describe('forOf', () => {
    it('should call the callback for all the elements', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let callback = jasmine.createSpy('Callback');

      Mappables.of(map).forOf(callback);
      expect(callback).toHaveBeenCalledWith(1, 'a', jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(2, 'b', jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(3, 'c', jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let callback = jasmine.createSpy('Callback').and
          .callFake((value: number, key: string, breakFn: () => void) => {
            if (key === 'b') {
              breakFn();
            }
          });

      Mappables.of(map).forOf(callback);
      expect(callback).toHaveBeenCalledWith(1, 'a', jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(2, 'b', jasmine.any(Function));
      expect(callback).not.toHaveBeenCalledWith(3, 'c', jasmine.any(Function));
    });
  });

  describe('iterate', () => {
    it('should iterate through for all the elements', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let callback = jasmine.createSpy('Callback');

      Mappables.of(map).iterate(callback);
      expect(callback).toHaveBeenCalledWith(['a', 1], jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(['b', 2], jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(['c', 3], jasmine.any(Function));
    });

    it('should stop the iteration when the break function is called', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let callback = jasmine.createSpy('Callback').and
          .callFake((entry: [string, number], breakFn: () => void) => {
            if (entry[0] === 'b') {
              breakFn();
            }
          });

      Mappables.of(map).iterate(callback);
      expect(callback).toHaveBeenCalledWith(['a', 1], jasmine.any(Function));
      expect(callback).toHaveBeenCalledWith(['b', 2], jasmine.any(Function));
      expect(callback).not.toHaveBeenCalledWith(['c', 3], jasmine.any(Function));
    });
  });

  describe('keys', () => {
    it('should return the correct set of keys', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      expect(Mappables.of(map).keys().asArray()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('map', () => {
    it('should apply the mapping function to the mappable', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let result = Mappables.of(map)
          .map((entry: [string, number]) => {
            return [
              entry[0] + '$',
              entry[1] + 1,
            ];
          })
          .asRecord();
      expect(result).toEqual({'a$': 2, 'b$': 3, 'c$': 4});
    });
  });

  describe('mapKey', () => {
    it('should apply the mapping function to the mappable', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let result = Mappables.of(map)
          .mapKey((value: number, key: string) => {
            return key + value;
          })
          .asRecord();
      expect(result).toEqual({'a1': 1, 'b2': 2, 'c3': 3});
    });
  });

  describe('mapValue', () => {
    it('should apply the mapping function to the mappable', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let result = Mappables.of(map)
          .mapValue<string>((value: number, key: string) => {
            return key + value;
          })
          .asRecord();
      expect(result).toEqual({'a': 'a1', 'b': 'b2', 'c': 'c3'});
    });
  });

  describe('removeAllKeys', () => {
    it('should remove all entries with keys in the given set', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      let result = Mappables.of(map)
          .removeAllKeys(new Set<string>(['a', 'c']))
          .asRecord();
      expect(result).toEqual({'b': 2});
    });
  });

  describe('values', () => {
    it('should return the correct set of values', () => {
      let map = new Map<string, number>(<[string, number][]> [['a', 1], ['b', 2], ['c', 3]]);
      expect(Mappables.of(map).values().asArray()).toEqual([1, 2, 3]);
    });
  });
});
