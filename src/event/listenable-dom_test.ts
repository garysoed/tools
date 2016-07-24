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

  describe('onEventTriggered_', () => {
    it('should call the handler if the event phase matches the useCapture', () => {
      let mockHandler = jasmine.createSpy('handler');
      let event = Mocks.object('event');
      event[ListenableDom['__EVENT_CAPTURE']] = true;

      listenable['onEventTriggered_'](mockHandler, true, event);

      expect(mockHandler).toHaveBeenCalledWith(event);
    });

    it('should call the handler if the event has no event phase', () => {
      let mockHandler = jasmine.createSpy('handler');
      let event = Mocks.object('event');

      listenable['onEventTriggered_'](mockHandler, true, event);

      expect(mockHandler).toHaveBeenCalledWith(event);
    });

    it('should not call the handler if the event phase does not match the useCapture', () => {
      let mockHandler = jasmine.createSpy('handler');
      let event = Mocks.object('event');
      event[ListenableDom['__EVENT_CAPTURE']] = true;

      listenable['onEventTriggered_'](mockHandler, false, event);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('dispatch', () => {
    it('should use the event target for dispatching events', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let eventType = 'eventType';
      let payload = Mocks.object('payload');

      listenable.dispatch(eventType, mockCallback, payload);

      expect(mockEventTarget.dispatchEvent).toHaveBeenCalledTimes(2);
      let captureEvent = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      expect(captureEvent['payload']).toEqual(payload);
      expect(captureEvent[ListenableDom['__EVENT_CAPTURE']]).toEqual(true);

      let bubbleEvent = mockEventTarget.dispatchEvent.calls.argsFor(1)[0];
      expect(bubbleEvent['payload']).toEqual(payload);
      expect(bubbleEvent[ListenableDom['__EVENT_CAPTURE']]).toEqual(false);

      expect(mockCallback).toHaveBeenCalledWith();
    });
  });

  describe('on', () => {
    it('should listen to the event target correctly', () => {
      let eventType = 'eventType';
      let callback = Mocks.object('callback');
      let useCapture = true;

      spyOn(listenable, 'onEventTriggered_');

      let disposableFunction = listenable.on(eventType, callback, useCapture);

      expect(mockEventTarget.addEventListener)
          .toHaveBeenCalledWith(eventType, jasmine.any(Function), useCapture);

      let registeredCallback = mockEventTarget.addEventListener.calls.argsFor(0)[1];
      let event = Mocks.object('event');
      registeredCallback(event);
      expect(listenable['onEventTriggered_']).toHaveBeenCalledWith(callback, useCapture, event);

      disposableFunction.dispose();
      expect(mockEventTarget.removeEventListener)
          .toHaveBeenCalledWith(eventType, registeredCallback, useCapture);
    });
  });
});
