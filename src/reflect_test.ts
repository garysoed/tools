import TestBase from './test-base';
TestBase.setup();

import Reflect from './reflect';


describe('Reflect', () => {
  describe('construct', () => {
    class TestClass {
      private a_: number;
      private b_: string;

      constructor(a: number, b: string) {
        this.a_ = a;
        this.b_ = b;
      }

      get a(): number {
        return this.a_;
      }

      get b(): string {
        return this.b_;
      }
    }

    it('should construct a new instance of the constructor', () => {
      let a = 123;
      let b = 'b';
      let instance = Reflect.construct(TestClass, [a, b]);

      expect(instance).toEqual(jasmine.any(TestClass));
      expect(instance.a).toEqual(a);
      expect(instance.b).toEqual(b);
    });
  });

  describe('overrideGetter', () => {
    class TestClass {
      get a(): number {
        return 1;
      }
    }

    it('should override the getter property', () => {
      let newValue = 'newValue';
      let object = new TestClass();
      Reflect.overrideGetter(object, 'a', newValue);
      expect(object.a).toEqual(newValue);
    });
  });
});
