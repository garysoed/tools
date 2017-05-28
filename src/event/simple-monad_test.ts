import { assert, TestBase } from '../test-base';
TestBase.setup();

import { SimpleMonad } from '../event/simple-monad';
import { Mocks } from '../mock/mocks';


describe('event.SimpleMonad', () => {
  let instance: any;
  let key: symbol;
  let value: number;
  let monad: SimpleMonad<number>;

  beforeEach(() => {
    instance = Mocks.object('instance');
    key = Symbol('key');
    value = 123;
    monad = new SimpleMonad<number>(instance, key, value);
  });

  describe('get', () => {
    it('should return the correct value', () => {
      assert(monad.get()).to.equal(value);
    });
  });

  describe('set', () => {
    it('should set the correct new value', () => {
      const newValue = 456;
      monad.set(newValue);
      assert(instance[key]).to.equal(newValue);
    });
  });

  describe('newFactory', () => {
    it('should create factory that returns the correct monad and initializes the value', () => {
      const monad = SimpleMonad.newFactory(key, value)(instance);
      assert(monad.get()).to.equal(value);
      assert(instance[key]).to.equal(value);
    });

    it('should not replace the instance value if already set', () => {
      const existingValue = 0;
      instance[key] = existingValue;
      const monad = SimpleMonad.newFactory(key, value)(instance);
      assert(monad.get()).to.equal(existingValue);
      assert(instance[key]).to.equal(existingValue);
    });
  });
});
