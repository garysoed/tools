import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { GraphTime, instanceId } from '../graph';
import { Listener } from '../persona/listener';
import { __time, SelectorImpl } from '../persona/selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';

class TestSelector extends SelectorImpl<any> {
  constructor() {
    super(12, Mocks.object('id'));
  }

  getListener(): Listener<any> {
    throw new Error('Method not implemented.');
  }

  getValue(): any {
    throw new Error('Method not implemented.');
  }

  setValue_(): void {
    throw new Error('Method not implemented.');
  }
}

describe('persona.SelectorImpl', () => {
  let selector: SelectorImpl<any>;

  beforeEach(() => {
    selector = new TestSelector();
  });

  describe('getProvider', () => {
    it(`should return function that returns the correct value`, () => {
      const root = Mocks.object('root');
      Object.setPrototypeOf(root, DocumentFragment.prototype);

      const ctrl = Mocks.object('ctrl');
      ctrl[__shadowRoot] = root;

      const value = Mocks.object('value');
      spyOn(selector, 'getValue').and.returnValue(value);

      assert(selector.getProvider().call(ctrl)).to.equal(value);
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return function that throws error if the context has no incorrect shadow roots`,
        () => {
      const root = Mocks.object('root');
      const ctrl = Mocks.object('ctrl');
      ctrl[__shadowRoot] = root;

      assert(() => {
        selector.getProvider().call(ctrl);
      }).to.throwError(/cannot find shadowRoot/i);
    });
  });

  describe('initAsInput', () => {
    it(`should initialize correctly`, () => {
      const root = Mocks.object('root');
      const mockCtrl = jasmine.createSpyObj('Ctrl', ['addDisposable']);
      const provider = Mocks.object('provider');
      const disposable = Mocks.object('disposable');
      const mockListener = jasmine.createSpyObj('Listener', ['start']);
      mockListener.start.and.returnValue(disposable);
      spyOn(selector, 'getListener').and.returnValue(mockListener);

      const updateProviderSpy = spyOn(selector, 'updateProvider_');

      selector.initAsInput(root, mockCtrl, provider);
      assert(selector['updateProvider_']).to.haveBeenCalledWith(root, mockCtrl, provider);
      assert(mockCtrl.addDisposable).to.haveBeenCalledWith(disposable);
      assert(mockListener.start).to
          .haveBeenCalledWith(root, Matchers.anyFunction(), selector, false);

      updateProviderSpy.calls.reset();
      mockListener.start.calls.argsFor(0)[1]();
      assert(selector['updateProvider_']).to.haveBeenCalledWith(root, mockCtrl, provider);
    });
  });

  describe('setValue', () => {
    it(`should update the value`, () => {
      const value = 123;
      const root = Mocks.object('root');
      const time = GraphTime.new();
      const newTime = time.increment();
      root[__time] = time;

      spyOn(selector, 'setValue_');

      selector.setValue(value, root, newTime);
      assert(selector['setValue_']).to.haveBeenCalledWith(value, root);
      assert(root[__time]).to.equal(newTime);
    });

    it(`should not update the value if the time is ancient`, () => {
      const value = 123;
      const root = Mocks.object('root');
      const time = GraphTime.new();
      root[__time] = time;

      spyOn(selector, 'setValue_');

      selector.setValue(value, root, time);
      assert(selector['setValue_']).toNot.haveBeenCalled();
      assert(root[__time]).to.equal(time);
    });

    it(`should update if there are no latest time`, () => {
      const value = 123;
      const root = Mocks.object('root');
      const time = GraphTime.new();

      spyOn(selector, 'setValue_');

      selector.setValue(value, root, time);
      assert(selector['setValue_']).to.haveBeenCalledWith(value, root);
      assert(root[__time]).to.equal(time);
    });
  });

  describe('updateProvider_', () => {
    it(`should update the provider correctly`, () => {
      const root = Mocks.object('root');
      const ctrl = Mocks.object('ctrl');
      const mockProvider = jasmine.createSpy('Provider');
      const value = 123;
      spyOn(selector, 'getValue').and.returnValue(value);
      spyOn(selector, 'getId').and.returnValue(instanceId('id', NumberType));

      selector['updateProvider_'](root, ctrl, mockProvider);
      assert(mockProvider).to.haveBeenCalledWith(value, ctrl);
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should use the default value if the type of the value is incorrect`, () => {
      const root = Mocks.object('root');
      const ctrl = Mocks.object('ctrl');
      const mockProvider = jasmine.createSpy('Provider');
      const value = 'value';
      spyOn(selector, 'getValue').and.returnValue(value);

      const defaultValue = 123;
      spyOn(selector, 'getDefaultValue').and.returnValue(defaultValue);
      spyOn(selector, 'getId').and.returnValue(instanceId('id', NumberType));

      selector['updateProvider_'](root, ctrl, mockProvider);
      assert(mockProvider).to.haveBeenCalledWith(defaultValue, ctrl);
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should throw error if the type is incorrect`, () => {
      const root = Mocks.object('root');
      const ctrl = Mocks.object('ctrl');
      const mockProvider = jasmine.createSpy('Provider');
      const value = 'value';
      spyOn(selector, 'getValue').and.returnValue(value);

      spyOn(selector, 'getDefaultValue').and.returnValue(undefined);
      spyOn(selector, 'getId').and.returnValue(instanceId('id', NumberType));

      assert(() => {
        selector['updateProvider_'](root, ctrl, mockProvider);
      }).to.throwError(/value for input/);
      assert(selector.getValue).to.haveBeenCalledWith(root);
    });
  });
});
