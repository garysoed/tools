import {assert, Matchers, TestBase} from '../test-base';
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

      assert(mockEventTarget.dispatchEvent).to.haveBeenCalledWith(Matchers.any(Event));
      let event = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      assert(event['payload']).to.equal(payload);
      assert(<boolean> event.bubbles).to.beTrue();

      assert(mockCallback).to.haveBeenCalledWith();
    });
  });

  describe('on', () => {
    it('should listen to the event target correctly', () => {
      let eventType = 'eventType';
      let callback = Mocks.object('callback');
      let useCapture = true;

      let disposableFunction = listenable.on(eventType, callback, useCapture);

      assert(mockEventTarget.addEventListener).to
          .haveBeenCalledWith(eventType, callback, useCapture);

      disposableFunction.dispose();
      assert(mockEventTarget.removeEventListener).to
          .haveBeenCalledWith(eventType, callback, useCapture);
    });
  });
});
