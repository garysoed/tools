import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Jsons} from './jsons';


describe('collection.Jsons', () => {
  describe('deepClone', () => {
    it('should clone the given object', () => {
      let original = {
        a: { b: 2 },
      };
      let clone = Jsons.deepClone(original);
      assert(clone).to.equal(original);
      assert(clone).toNot.be(original);
    });
  });

  describe('getValue', () => {
    it('should retrieve the value correctly', () => {
      let json = {a: {b: {c: 123}}};
      assert(Jsons.getValue(json, 'a.b')).to.equal({c: 123});
    });

    it('should return undefined if the path does not exist', () => {
      let json = {a: {b: {c: 123}}};
      assert(Jsons.getValue(json, 'a.b.d')).to.equal(undefined);
    });
  });

  describe('mixin', () => {
    it('should copy the source keys to the destination object', () => {
      let dest = { a: 1 };
      let source = { b: 2, c: 3 };
      Jsons.mixin(source, dest);

      assert(dest).to.equal({ a: 1, b: 2, c: 3 });
    });

    it('should recursively mixin the values', () => {
      let dest = { a: { ab: 1 } };
      let source = { a: { cd: 2 } };
      Jsons.mixin(source, dest);
      assert(dest).to.equal({
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
      assert(dest.a).to.equal(2);
    });
  });

  describe('setTemporaryValue', () => {
    it('should run the callback with the values set temporarily', () => {
      let json = {a: 1};
      let callback = jasmine.createSpy('callback');
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
      let innerObj = { };
      let obj = { 'a': innerObj };
      Jsons.setValue(obj, 'a.b.c', 123);
      assert(obj).to.equal({ 'a': innerObj });
      assert(innerObj).to.equal({ 'b': { 'c': 123 } });
    });

    it('should handle a single value', () => {
      let obj = { };
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
