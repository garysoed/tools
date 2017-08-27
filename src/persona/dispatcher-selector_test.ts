import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { dispatcherSelector } from '../persona';
import { ElementSelectorImpl } from '../persona/element-selector';

describe('persona.DispatcherSelectorImpl', () => {
  describe('getValue', () => {
    it(`should dispatch the correct event`, async () => {
      const root = Mocks.object('root');
      const eventType = 'eventType';
      const payload = 123;
      const element = document.createElement('div');
      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const mockHandler = jasmine.createSpy('Handler');
      element.addEventListener(eventType, mockHandler);

      const selector = dispatcherSelector(mockElementSelector);
      await selector.getValue(root)!(eventType, payload) as Promise<number>;
      assert(mockHandler).to.haveBeenCalledWith(Matchers.objectContaining({
        bubbles: true,
        detail: payload,
        type: eventType,
      }));
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });
  });
});
