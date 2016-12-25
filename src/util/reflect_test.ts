import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {Reflect} from './reflect';


describe('Reflect', () => {
  describe('construct', () => {
    class TestClass {
      private a_: number;
      private b_: string;

      constructor(a: number, b: string) {
        this.a_ = a;
        this.b_ = b;
      }

      static [Reflect.__initialize](instance: TestClass): void { }

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

      TestClass.prototype[Reflect.__initialize] = jasmine.createSpy('initialize');

      let instance: TestClass = Reflect.construct(TestClass, [a, b]);
      assert(instance).to.equal(Matchers.any(TestClass));
      assert(instance.a).to.equal(a);
      assert(instance.b).to.equal(b);
      assert(instance[Reflect.__initialize]).to.haveBeenCalledWith(instance);
    });
  });

  describe('overrideGetter', () => {
    class TestClass {
      get a(): number {
        return 1;
      }
    }

    it('should override the getter property', () => {
      let newValue = 123;
      let object = new TestClass();
      Reflect.overrideGetter(object, 'a', newValue);
      assert(object.a).to.equal(newValue);
    });
  });
});
