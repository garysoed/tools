import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { SelectorImpl } from '../persona/selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';

class TestSelector extends SelectorImpl<any> {
  constructor() {
    super(Mocks.object('id'));
  }

  getValue(): any {
    throw new Error('Method not implemented.');
  }

  setValue(): void {
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
});
