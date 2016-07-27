import {TestBase} from '../test-base';
TestBase.setup();

import {ListenableDom} from './listenable-dom';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';


describe('event.ListenableDom', () => {
  let mockEventTarget;
  let listenable;

  beforeEach(() => {
    mockEventTarget = jasmine.createSpyObj(
        'EventTarget',
        ['addEventListener', 'dispatchEvent', 'removeEventListener']);
    listenable = new ListenableDom(mockEventTarget);
    TestDispose.add(listenable);
  });

  describe('dispatch', () => {
    it('should use the event target for dispatching events', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let eventType = 'eventType';
      let payload = Mocks.object('payload');

      listenable.dispatch(eventType, mockCallback, payload);

      expect(mockEventTarget.dispatchEvent).toHaveBeenCalledWith(jasmine.any(Event));
      let event = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      expect(event['payload']).toEqual(payload);
      expect(event.bubbles).toEqual(true);

      expect(mockCallback).toHaveBeenCalledWith();
    });
  });

  describe('on', () => {
    it('should listen to the event target correctly', () => {
      let eventType = 'eventType';
      let callback = Mocks.object('callback');
      let useCapture = true;

      let disposableFunction = listenable.on(eventType, callback, useCapture);

      expect(mockEventTarget.addEventListener)
          .toHaveBeenCalledWith(eventType, callback, useCapture);

      disposableFunction.dispose();
      expect(mockEventTarget.removeEventListener)
          .toHaveBeenCalledWith(eventType, callback, useCapture);
    });
  });
});
