import TestBase from '../test-base';
TestBase.setup();

import Inject from './a-inject';
import {Injector} from './injector';
import {Mocks} from '../mock/mocks';
import Reflect from '../reflect';


describe('inject.Injector', () => {
  let mockBindings;
  let injector;

  beforeEach(() => {
    injector = new Injector();
    mockBindings = new Map<string | symbol, any>();
    Injector['BINDINGS_'] = mockBindings;
  });

  describe('getBoundValue', () => {
    it('should instantiate the constructor correctly', () => {
      let bindKey = 'bindKey';
      let mockInstance = Mocks.object('Instance');
      let mockProvider = jasmine.createSpy('Provider');
      mockProvider.and.returnValue(mockInstance);
      mockBindings.set(bindKey, mockProvider);

      expect(injector.getBoundValue(bindKey)).toEqual(mockInstance);
      expect(mockProvider).toHaveBeenCalledWith(injector);
      expect(injector['instances_'].get(bindKey)).toEqual(mockInstance);
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
  });

  describe('getParameters', () => {
    class TestClass {
      constructor(a: string, b: string) { }
    }

    it('should return the parameters correctly', () => {
      let key1 = 'key1';
      let key2 = 'key2';
      let mockValue1 = Mocks.object('Value1');
      let mockValue2 = Mocks.object('Value2');
      let metadata = new Map<number, string>();
      metadata.set(0, key1);
      metadata.set(1, key2);
      spyOn(Inject, 'getMetadata').and.returnValue(metadata);

      spyOn(injector, 'getBoundValue').and.callFake((name: string) => {
        switch (name) {
          case key1:
            return mockValue1;
          case key2:
            return mockValue2;
          default:
            return null;
        }
      });

      expect(injector.getParameters(TestClass)).toEqual([mockValue1, mockValue2]);
      expect(injector.getBoundValue).toHaveBeenCalledWith(key1);
      expect(injector.getBoundValue).toHaveBeenCalledWith(key2);
      expect(Inject.getMetadata).toHaveBeenCalledWith(TestClass);
    });

    it('should use the extra arguments to override the parameters', () => {
      let mockValue1 = Mocks.object('Value1');
      let mockValue2 = Mocks.object('Value2');
      spyOn(Inject, 'getMetadata').and.returnValue(new Map<number, string>());

      let parameters = injector.getParameters(TestClass, {0: mockValue1, 1: mockValue2});
      expect(parameters).toEqual([mockValue1, mockValue2]);
      expect(Inject.getMetadata).toHaveBeenCalledWith(TestClass);
    });

    it('should throw error if an index is not in the metadata', () => {
      spyOn(Inject, 'getMetadata').and.returnValue(new Map<number, string>());

      expect(() => {
        injector.getParameters(TestClass);
      }).toThrowError(/Cannot find injection candidate/);
    });
  });

  describe('instantiate', () => {
    class TestClass {}

    it('should instantiate the constructor correctly', () => {
      let mockExtraArguments = Mocks.object('ExtraArguments');
      let mockParameters = Mocks.object('Parameters');
      let mockInstance = Mocks.object('Instance');

      spyOn(injector, 'getParameters').and.returnValue(mockParameters);
      spyOn(Reflect, 'construct').and.returnValue(mockInstance);

      expect(injector.instantiate(TestClass, mockExtraArguments)).toEqual(mockInstance);
      expect(injector.getParameters).toHaveBeenCalledWith(TestClass, mockExtraArguments);
      expect(Reflect.construct).toHaveBeenCalledWith(TestClass, mockParameters);
    });
  });

  describe('bind', () => {
    class TestClass { }

    it('should bind the correct provider', () => {
      let bindKey = 'bindKey';
      let mockInstance = Mocks.object('Instance');
      let mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
      mockInjector.instantiate.and.returnValue(mockInstance);

      let bindProviderSpy = spyOn(Injector, 'bindProvider');

      Injector.bind(TestClass, bindKey);
      expect(Injector.bindProvider).toHaveBeenCalledWith(jasmine.any(Function), bindKey);

      expect(bindProviderSpy.calls.argsFor(0)[0](mockInjector)).toEqual(mockInstance);
      expect(mockInjector.instantiate).toHaveBeenCalledWith(TestClass);
    });
  });

  describe('bindProvider', () => {
    it('should set the BINDINGS_ map correctly', () => {
      let mockProvider = Mocks.object('Provider');
      let bindKey = 'bindKey';
      Injector.bindProvider(mockProvider, bindKey);

      expect(Injector['BINDINGS_'].size).toEqual(1);
      expect(Injector['BINDINGS_'].get(bindKey)).toEqual(mockProvider);
    });

    it('should throw error if the binding key is already bound', () => {
      let mockProvider = Mocks.object('Provider');
      let bindKey = 'bindKey';
      Injector.bind(mockProvider, bindKey);

      expect(() => {
        Injector.bind(mockProvider, bindKey);
      }).toThrowError(/is already bound/);
    });

    it('should throw error if the binding key is a reserved key', () => {
      expect(() => {
        Injector.bind(Mocks.object('Provider'), '$gsInjector');
      }).toThrowError(/is a reserved key/);
    });
  });
});
