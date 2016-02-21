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
});
