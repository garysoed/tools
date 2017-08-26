import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { EventListener } from '../persona/event-listener';


describe('persona.EventListener', () => {
  let mockSelector: any;
  let listener: EventListener<'click'>;

  beforeEach(() => {
    mockSelector = jasmine.createSpyObj('Selector', ['getValue']);
    listener = new EventListener<'click'>(mockSelector, 'click');
  });

  describe('start', () => {
    it(`should add and remove event correctly`, () => {
      const shadowRoot = Mocks.object('shadowRoot');
      const mockHandler = jasmine.createSpy('Handler');
      const useCapture = false;

      const button = document.createElement('button');
      mockSelector.getValue.and.returnValue(button);

      const deregister = listener.start(shadowRoot, mockHandler, useCapture);
      button.click();
      assert(mockHandler).to.haveBeenCalledWith(Matchers.objectContaining({type: 'click'}));

      assert(mockSelector.getValue).to.haveBeenCalledWith(shadowRoot);

      mockHandler.calls.reset();
      deregister.dispose();
      button.click();
      assert(mockHandler).toNot.haveBeenCalled();
    });
  });
});
