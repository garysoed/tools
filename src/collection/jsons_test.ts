import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Jsons } from './jsons';


describe('collection.Jsons', () => {
  describe('deepClone', () => {
    it('should clone the given object', () => {
      const original = {
        a: { b: 2 },
      };
      const clone = Jsons.deepClone(original);
      assert(clone).to.equal(original);
      assert(clone).toNot.be(original);
    });
  });

  describe('getValue', () => {
    it('should retrieve the value correctly', () => {
      const json = {a: {b: {c: 123}}};
      assert(Jsons.getValue(json, 'a.b')).to.equal({c: 123});
    });

    it('should return undefined if the path does not exist', () => {
      const json = {a: {b: {c: 123}}};
      assert(Jsons.getValue(json, 'a.b.d')).to.equal(undefined);
    });
  });

  describe('mixin', () => {
    it('should copy the source keys to the destination object', () => {
      const dest = { a: 1 };
      const source = { b: 2, c: 3 };
      Jsons.mixin(source, dest);

      assert(dest).to.equal({ a: 1, b: 2, c: 3 });
    });

    it('should recursively mixin the values', () => {
      const dest = { a: { ab: 1 } };
      const source = { a: { cd: 2 } };
      Jsons.mixin(source, dest);
      assert(dest).to.equal({
        a: {
          ab: 1,
          cd: 2,
        },
      });
    });

    it('should ignore if keys conflict for non objects', () => {
      const dest = { a: 2 };
      const source = { a: 1 };
      Jsons.mixin(source, dest);
      assert(dest.a).to.equal(2);
    });
  });

  describe('setTemporaryValue', () => {
    it('should run the callback with the values set temporarily', () => {
      const json = {a: 1};
      const callback = jasmine.createSpy('callback');
      Jsons.setTemporaryValue(
          json,
          {a: 'one', b: 'two'},
          () => {
            callback(json['a'], json['b']);
          });

      assert(json).to.equal({a: 1, b: undefined});
      assert(callback).to.haveBeenCalledWith('one', 'two');
    });
  });

  describe('setValue', () => {
    it('should set the value at the correct location', () => {
      const innerObj = { };
      const obj = { 'a': innerObj };
      Jsons.setValue(obj, 'a.b.c', 123);
      assert(obj).to.equal({ 'a': innerObj });
      assert(innerObj).to.equal({ 'b': { 'c': 123 } });
    });

    it('should handle a single value', () => {
      const obj = { };
      Jsons.setValue(obj, 'abc', 123);
      assert(obj).to.equal({ 'abc': 123 });
    });

    it('should throw error when the path is empty', () => {
      assert(() => {
        Jsons.setValue({ }, '', 123);
      }).to.throwError(/to not be empty/);
    });
  });
});
