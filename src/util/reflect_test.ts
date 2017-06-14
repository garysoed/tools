import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Reflect } from './reflect';


describe('Reflect', () => {
  describe('addInitializer', () => {
    it(`should call the original initializer if exists`, () => {
      class InitializedClass {
        [Reflect.__initialize](): void { }
      }

      const mockInitializer = jasmine.createSpy('Initializer');

      const initializerSpy = spyOn(InitializedClass.prototype, Reflect.__initialize);
      Reflect.addInitializer(InitializedClass, mockInitializer);
      const instance = Reflect.construct(InitializedClass, []);
      assert(initializerSpy).to.haveBeenCalledWith(instance);
      assert(mockInitializer).to.haveBeenCalledWith(instance);
    });

    it(`should not throw error if original initializer does not exist`, () => {
      class UninitializedClass { }

      const mockInitializer = jasmine.createSpy('Initializer');

      Reflect.addInitializer(UninitializedClass, mockInitializer);
      const instance = Reflect.construct(UninitializedClass, []);
      assert(mockInitializer).to.haveBeenCalledWith(instance);
    });
  });

  describe('construct', () => {
    class TestClass {
      private a_: number;
      private b_: string;

      constructor(a: number, b: string) {
        this.a_ = a;
        this.b_ = b;
      }

      static [Reflect.__initialize](): void { }

      get a(): number {
        return this.a_;
      }

      get b(): string {
        return this.b_;
      }
    }

    it('should construct a new instance of the constructor', () => {
      const a = 123;
      const b = 'b';

      TestClass.prototype[Reflect.__initialize] = jasmine.createSpy('initialize');

      const instance: TestClass = Reflect.construct(TestClass, [a, b]);
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
      const newValue = 123;
      const object = new TestClass();
      Reflect.overrideGetter(object, 'a', newValue);
      assert(object.a).to.equal(newValue);
    });
  });
});
