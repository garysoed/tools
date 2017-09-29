import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { GraphTime } from '../graph';
import { __time, SelectorImpl } from '../persona/selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';

class TestSelector extends SelectorImpl<any> {
  constructor() {
    super(12, Mocks.object('id'));
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
});
