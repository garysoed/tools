import TestBase from '../test-base';
TestBase.setup();

import Injector from './injector';
import Maps from '../collection/maps';
import Mocks from '../mock/mocks';


describe('inject.Injector', () => {
  let mockBindings;
  let injector;

  beforeEach(() => {
    injector = new Injector();
    mockBindings = new Map<string | symbol, any>();
    Injector['BINDINGS_'] = mockBindings;
  });

  describe('bindValue', () => {
    it('should bind the given value', () => {
      let bindKey = 'bindKey';
      let mockBindValue = Mocks.object('BindValue');

      injector.bindValue(bindKey, mockBindValue);

      expect(injector.getBoundValue(bindKey)).toEqual(mockBindValue);
    });

    it('should throw error if the given bind key is already bound', () => {
      let bindKey = 'bindKey';
      injector['instances_'].set(bindKey, Mocks.object('BindValue'));
      expect(() => {
        injector.bindValue(bindKey, Mocks.object('BindValue2'));
      }).toThrowError(/is already bound/);
    });

    it('should throw error if the given bind key is already bound globally', () => {
      let bindKey = 'bindKey';
      mockBindings.set(bindKey, Mocks.object('BindValue'));
      expect(() => {
        injector.bindValue(bindKey, Mocks.object('BindValue2'));
      }).toThrowError(/is already bound to a ctor/);
    });
  });

  describe('getBoundValue', () => {
    it('should instantiate the constructor correctly', () => {
      class TestClass {
        a: string;
        b: string;
        c: string;

        constructor(a: string, b: string, c: string) {
          this.a = a;
          this.b = b;
          this.c = c;
        }
      }

      let bindKey = 'bindKey';
      let boundArgs = new Map<number, any>();
      boundArgs.set(1, 'b');
      mockBindings.set(bindKey, { boundArgs: boundArgs, ctor: TestClass });
      TestClass[Injector['__metadata']] = Maps.fromArray(['a', undefined, 'c']).data;

      let originalGetBoundValue = injector.getBoundValue;

      spyOn(injector, 'getBoundValue').and.callFake((bindKey: string) => {
        return bindKey;
      });

      let instance = originalGetBoundValue.call(injector, bindKey);
      expect(instance.a).toEqual('a');
      expect(instance.b).toEqual('b');
      expect(instance.c).toEqual('c');

      expect(injector['instances_'].get(bindKey)).toEqual(instance);
    });

    it('should return the cached value', () => {
      let cachedInstance = Mocks.object('cachedInstance');
      let bindKey = 'bindKey';
      injector['instances_'].set(bindKey, cachedInstance);

      expect(injector.getBoundValue(bindKey)).toBe(cachedInstance);
    });

    it('should throw error if the bind key does not exist', () => {
      expect(() => {
        injector.getBoundValue('bindKey');
      }).toThrowError(/No value bound to key/);
    });

    it('should throw error if an injection index is not recognized', () => {
      class TestClass {
        constructor(a: string) { }
      }

      let bindKey = 'bindKey';
      mockBindings.set(bindKey, { boundArgs: new Map<number, any>(), ctor: TestClass });

      expect(() => {
        injector.getBoundValue('bindKey');
      }).toThrowError(/Cannot find injection candidate/);
    });
  });

  describe('instantiate', () => {
    it('should instantiate the constructor correctly', () => {
      class TestClass {
        a: string;
        b: string;
        c: string;

        constructor(a: string, b: string, c: string) {
          this.a = a;
          this.b = b;
          this.c = c;
        }
      }

      let ctorA = Mocks.object('ctorA');
      let ctorC = Mocks.object('ctorC');
      TestClass[Injector['__metadata']] = Maps.fromArray([ctorA, undefined, ctorC]).data;

      spyOn(injector, 'getBoundValue').and.callFake((bindKey: string) => {
        return bindKey;
      });

      let instance = injector.instantiate(TestClass, { 1: 'b' });
      expect(instance.a).toEqual(ctorA);
      expect(instance.b).toEqual('b');
      expect(instance.c).toEqual(ctorC);

      expect(injector.getBoundValue).toHaveBeenCalledWith(ctorA);
      expect(injector.getBoundValue).toHaveBeenCalledWith(ctorC);
    });

    it('should override the @Inject parameters with the extra argument', () => {
      class TestClass {
        a: string;

        constructor(a: string) {
          this.a = a;
        }
      }

      let ctorA = Mocks.object('ctorA');
      TestClass[Injector['__metadata']] = Maps.fromArray([ctorA]).data;

      spyOn(injector, 'getBoundValue').and.callFake((bindKey: string) => {
        return bindKey;
      });

      let instance = injector.instantiate(TestClass, { 0: 'a' });
      expect(instance.a).toEqual('a');
    });

    it('should throw error if an injection index is not recognized', () => {
      class TestClass {
        constructor(a: string) { }
      }

      expect(() => {
        injector.instantiate(TestClass);
      }).toThrowError(/Cannot find injection candidate/);
    });
  });

  describe('bind', () => {
    class TestClass { }

    it('should set the BINDINGS_ map correctly', () => {
      let bindKey = 'bindKey';
      Injector.bind(TestClass, bindKey, { 0: 'a', 1: 'b' });

      expect(Injector['BINDINGS_'].size).toEqual(1);
      expect(Injector['BINDINGS_'].get(bindKey).ctor).toEqual(TestClass);

      let extraArgs = Injector['BINDINGS_'].get(bindKey).boundArgs;
      expect(extraArgs.size).toEqual(2);
      expect(extraArgs.get(0)).toEqual('a');
      expect(extraArgs.get(1)).toEqual('b');
    });

    it('should throw error if the binding key is already bound', () => {
      let bindKey = 'bindKey';
      Injector.bind(TestClass, bindKey);

      expect(() => {
        Injector.bind(TestClass, bindKey);
      }).toThrowError(/is already bound/);
    });

    it('should throw error if the binding key is a reserved key', () => {
      expect(() => {
        Injector.bind(TestClass, '$gsInjector');
      }).toThrowError(/is a reserved key/);
    });
  });

  describe('registerInject', () => {
    it('should add the metadata correctly', () => {
      class TestClass { }

      let bindKey = 'bindKey';
      let index = 123;
      Injector.registerInject(bindKey, TestClass, index);

      let metadataMap = TestClass[Injector['__metadata']];
      expect(metadataMap.size).toEqual(1);
      expect(metadataMap.get(index)).toEqual(bindKey);
    });

    it('should add to the previously added metadata', () => {
      class TestClass { }

      let bindKey1 = 'bindKey1';
      let bindKey2 = 'bindKey2';

      let index1 = 123;
      let index2 = 456;
      Injector.registerInject(bindKey1, TestClass, index1);
      Injector.registerInject(bindKey2, TestClass, index2);

      let metadataMap = TestClass[Injector['__metadata']];
      expect(metadataMap.size).toEqual(2);
      expect(metadataMap.get(index1)).toEqual(bindKey1);
      expect(metadataMap.get(index2)).toEqual(bindKey2);
    });

    it('should throw error if the index already exist', () => {
      class TestClass { }

      let index = 123;
      Injector.registerInject('bindKey', TestClass, index);

      expect(() => {
        Injector.registerInject('otherBindKey', TestClass, index);
      }).toThrowError(/already exists/);
    });
  });
});
