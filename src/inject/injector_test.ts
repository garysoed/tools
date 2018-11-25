import { assert, match, should, test } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpy, createSpyInstance, fake, spy } from 'gs-testing/export/spy';
import { InjectUtil } from '../inject/inject-util';
import { Injector } from '../inject/injector';
import { InjectMetadata } from './inject-metadata';


test.skip('inject.Injector', () => {
  let mockBindings: Map<string | symbol, any>;
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
    mockBindings = new Map<string | symbol, any>();
    Injector['BINDINGS_'] = mockBindings;
  });

  test('getBoundValue', () => {
    should('instantiate the constructor correctly', () => {
      const bindKey = 'bindKey';
      const mockInstance = mocks.object('Instance');
      const mockProvider = createSpy('Provider');
      fake(mockProvider).always().return(mockInstance);
      mockBindings.set(bindKey, mockProvider);

      assert(injector.getBoundValue(bindKey)).to.equal(mockInstance);
      assert(mockProvider).to.haveBeenCalledWith(injector);
      assert(injector['instances_'].get(bindKey)).to.equal(mockInstance);
    });

    should('return the cached value', () => {
      const cachedInstance = mocks.object('cachedInstance');
      const bindKey = 'bindKey';
      injector['instances_'].set(bindKey, cachedInstance);

      assert(injector.getBoundValue(bindKey)).to.equal(cachedInstance);
    });

    should('throw error if the bind key does not exist', () => {
      assert(() => {
        injector.getBoundValue('bindKey');
      }).to.throwErrorWithMessage(/No value bound to key/);
    });

    should('return undefined if the key does not exist and it is optional', () => {
      assert(injector.getBoundValue('bindKey', true)).toNot.beDefined();
    });
  });

  test('getParameters', () => {
    class TestClass {
      constructor(_a: string, _b: string) { }
    }

    should('return the parameters correctly', () => {
      const metadata1 = {getKeyName: () => 'key1', isOptional: () => true};
      const metadata2 = {getKeyName: () => 'key2', isOptional: () => false};
      const mockValue1 = mocks.object('Value1');
      const mockValue2 = mocks.object('Value2');
      const metadata = new Map<number, any>();
      metadata.set(0, metadata1);
      metadata.set(1, metadata2);
      const getMetadataMapSpy = spy(InjectUtil, 'getMetadataMap');
      fake(getMetadataMapSpy).always().return(metadata);

      const getBoundValueSpy = spy(injector, 'getBoundValue');
      fake(getBoundValueSpy)
          .when(metadata1.getKeyName()).return(mockValue1)
          .when(metadata2.getKeyName()).return(mockValue2)
          .always().return(null);

      assert(injector.getParameters(TestClass)).to.haveExactElements([mockValue1, mockValue2]);
      assert(getBoundValueSpy).to
          .haveBeenCalledWith(metadata1.getKeyName(), metadata1.isOptional());
      assert(getBoundValueSpy).to
          .haveBeenCalledWith(metadata2.getKeyName(), metadata2.isOptional());
      assert(getMetadataMapSpy).to.haveBeenCalledWith(TestClass);
    });

    should('use the extra arguments to override the parameters', () => {
      const mockValue1 = mocks.object('Value1');
      const mockValue2 = mocks.object('Value2');
      const getMetadataMapSpy = spy(InjectUtil, 'getMetadataMap');
      fake(getMetadataMapSpy).always().return(new Map<number, InjectMetadata>());

      const parameters = injector.getParameters(TestClass, {0: mockValue1, 1: mockValue2});
      assert(parameters).to.haveExactElements([mockValue1, mockValue2]);
      assert(getMetadataMapSpy).to.haveBeenCalledWith(TestClass);
    });

    should('throw error if an index is not in the metadata', () => {
      fake(spy(InjectUtil, 'getMetadataMap')).always().return(new Map<number, InjectMetadata>());

      assert(() => {
        injector.getParameters(TestClass);
      }).to.throwErrorWithMessage(/Cannot find injection candidate/);
    });
  });

  test('instantiate', () => {
    class TestClass {}

    should('instantiate the constructor correctly', () => {
      const mockExtraArguments = mocks.object('ExtraArguments');
      const mockParameters = mocks.object<any[]>('Parameters');
      const mockInstance = mocks.object('Instance');

      const getParametersSpy = spy(injector, 'getParameters');
      fake(getParametersSpy).always().return(mockParameters);
      const constructSpy = spy(Reflect, 'construct');
      fake(constructSpy).always().return(mockInstance);

      assert(injector.instantiate(TestClass, mockExtraArguments)).to.equal(mockInstance);
      assert(getParametersSpy).to.haveBeenCalledWith(TestClass, mockExtraArguments);
      assert(constructSpy).to.haveBeenCalledWith(TestClass, mockParameters);
    });
  });

  test('bind', () => {
    class TestClass { }

    should('bind the correct provider', () => {
      const bindKey = 'bindKey';
      const mockInstance = mocks.object('Instance');
      const mockInjector = createSpyInstance(Injector);
      fake(mockInjector.instantiate).always().return(mockInstance);

      const bindProviderSpy = spy(Injector, 'bindProvider');

      Injector.bind(TestClass, bindKey);
      const functionMatcher = match.anyThat<(injector: Injector) => any>().beAFunction();
      assert(bindProviderSpy).to.haveBeenCalledWith(functionMatcher, bindKey);

      assert(functionMatcher.getLastMatch()).to.equal(mockInstance);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(TestClass);
    });
  });

  test('bindProvider', () => {
    should('set the BINDINGS_ map correctly', () => {
      const mockProvider = mocks.object<(injector: Injector) => any>('Provider');
      const bindKey = 'bindKey';
      Injector.bindProvider(mockProvider, bindKey);

      assert(Injector['BINDINGS_'].size).to.equal(1);
      assert(Injector['BINDINGS_'].get(bindKey)).to.equal(mockProvider);
    });

    should('throw error if the binding key is already bound', () => {
      const mockProvider = mocks.object<gs.ICtor<any>>('Provider');
      const bindKey = 'bindKey';
      Injector.bind(mockProvider, bindKey);

      assert(() => {
        Injector.bind(mockProvider, bindKey);
      }).to.throwErrorWithMessage(/is already bound/);
    });

    should('throw error if the binding key is a reserved key', () => {
      assert(() => {
        Injector.bind(mocks.object('Provider'), '$gsInjector');
      }).to.throwErrorWithMessage(/is a reserved key/);
    });
  });
});
