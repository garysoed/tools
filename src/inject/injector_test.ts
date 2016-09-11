import {assert, TestBase} from '../test-base';
TestBase.setup();

import {InjectUtil} from './inject-util';
import {Injector} from './injector';
import {Mocks} from '../mock/mocks';
import Reflect from '../util/reflect';


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

      assert(injector.getBoundValue(bindKey)).to.equal(mockInstance);
      assert(mockProvider).to.haveBeenCalledWith(injector);
      assert(injector['instances_'].get(bindKey)).to.equal(mockInstance);
    });

    it('should return the cached value', () => {
      let cachedInstance = Mocks.object('cachedInstance');
      let bindKey = 'bindKey';
      injector['instances_'].set(bindKey, cachedInstance);

      assert(injector.getBoundValue(bindKey)).to.be(cachedInstance);
    });

    it('should throw error if the bind key does not exist', () => {
      assert(() => {
        injector.getBoundValue('bindKey');
      }).to.throwError(/No value bound to key/);
    });

    it('should return undefined if the key does not exist and it is optional', () => {
      assert(injector.getBoundValue('bindKey', true)).toNot.beDefined();
    });
  });

  describe('getParameters', () => {
    class TestClass {
      constructor(a: string, b: string) { }
    }

    it('should return the parameters correctly', () => {
      let metadata1 = {isOptional: true, keyName: 'key1'};
      let metadata2 = {isOptional: false, keyName: 'key2'};
      let mockValue1 = Mocks.object('Value1');
      let mockValue2 = Mocks.object('Value2');
      let metadata = new Map<number, any>();
      metadata.set(0, metadata1);
      metadata.set(1, metadata2);
      spyOn(InjectUtil, 'getMetadataMap').and.returnValue(metadata);

      spyOn(injector, 'getBoundValue').and.callFake((name: string) => {
        switch (name) {
          case metadata1.keyName:
            return mockValue1;
          case metadata2.keyName:
            return mockValue2;
          default:
            return null;
        }
      });

      assert(injector.getParameters(TestClass)).to.equal([mockValue1, mockValue2]);
      assert(injector.getBoundValue).to.haveBeenCalledWith(metadata1.keyName, metadata1.isOptional);
      assert(injector.getBoundValue).to.haveBeenCalledWith(metadata2.keyName, metadata2.isOptional);
      assert(InjectUtil.getMetadataMap).to.haveBeenCalledWith(TestClass);
    });

    it('should use the extra arguments to override the parameters', () => {
      let mockValue1 = Mocks.object('Value1');
      let mockValue2 = Mocks.object('Value2');
      spyOn(InjectUtil, 'getMetadataMap').and.returnValue(new Map<number, string>());

      let parameters = injector.getParameters(TestClass, {0: mockValue1, 1: mockValue2});
      assert(parameters).to.equal([mockValue1, mockValue2]);
      assert(InjectUtil.getMetadataMap).to.haveBeenCalledWith(TestClass);
    });

    it('should throw error if an index is not in the metadata', () => {
      spyOn(InjectUtil, 'getMetadataMap').and.returnValue(new Map<number, string>());

      assert(() => {
        injector.getParameters(TestClass);
      }).to.throwError(/Cannot find injection candidate/);
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

      assert(injector.instantiate(TestClass, mockExtraArguments)).to.equal(mockInstance);
      assert(injector.getParameters).to.haveBeenCalledWith(TestClass, mockExtraArguments);
      assert(Reflect.construct).to.haveBeenCalledWith(TestClass, mockParameters);
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
      assert(Injector.bindProvider).to.haveBeenCalledWith(<any> jasmine.any(Function), bindKey);

      assert(bindProviderSpy.calls.argsFor(0)[0](mockInjector)).to.equal(mockInstance);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(TestClass);
    });
  });

  describe('bindProvider', () => {
    it('should set the BINDINGS_ map correctly', () => {
      let mockProvider = Mocks.object('Provider');
      let bindKey = 'bindKey';
      Injector.bindProvider(mockProvider, bindKey);

      assert(Injector['BINDINGS_'].size).to.equal(1);
      assert(Injector['BINDINGS_'].get(bindKey)).to.equal(mockProvider);
    });

    it('should throw error if the binding key is already bound', () => {
      let mockProvider = Mocks.object('Provider');
      let bindKey = 'bindKey';
      Injector.bind(mockProvider, bindKey);

      assert(() => {
        Injector.bind(mockProvider, bindKey);
      }).to.throwError(/is already bound/);
    });

    it('should throw error if the binding key is a reserved key', () => {
      assert(() => {
        Injector.bind(Mocks.object('Provider'), '$gsInjector');
      }).to.throwError(/is a reserved key/);
    });
  });
});
