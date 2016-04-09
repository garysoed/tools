import TestBase from './test-base';
TestBase.setup();

import Jsons from './jsons';

describe('Jsons', () => {
  describe('deepClone', () => {
    it('should clone the given object', () => {
      let original = {
        a: { b: 2 }
      };
      let clone = Jsons.deepClone(original);
      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
    });
  });

  describe('mixin', () => {
    it('should copy the source keys to the destination object', () => {
      let dest = { a: 1 };
      let source = { b: 2, c: 3 };
      Jsons.mixin(source, dest);

      expect(dest).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should recursively mixin the values', () => {
      let dest = { a: { ab: 1 } };
      let source = { a: { cd: 2 } };
      Jsons.mixin(source, dest);
      expect(dest).toEqual({
        a: {
          ab: 1,
          cd: 2,
        },
      });
    });

    it('should ignore if keys conflict for non objects', () => {
      let dest = { a: 2 };
      let source = { a: 1 };
      Jsons.mixin(source, dest);
      expect(dest.a).toEqual(2);
    });
  });

  describe('setValue', () => {
    it('should set the value at the correct location', () => {
      let innerObj = { };
      let obj = { 'a': innerObj };
      Jsons.setValue(obj, 'a.b.c', 123);
      expect(obj).toEqual({ 'a': innerObj });
      expect(innerObj).toEqual({ 'b': { 'c': 123 } });
    });

    it('should handle a single value', () => {
      let obj = { };
      Jsons.setValue(obj, 'abc', 123);
      expect(obj).toEqual({ 'abc': 123 });
    });

    it('should throw error when the path is empty', () => {
      expect(() => {
        Jsons.setValue({ }, '', 123);
      }).toThrowError();
    });
  });
});
