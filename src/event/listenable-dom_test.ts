import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';

import { ListenableDom } from './listenable-dom';


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
      const mockCallback = jasmine.createSpy('Callback');
      const eventType = 'eventType';
      const payload = Mocks.object('payload');

      listenable.dispatch(eventType, mockCallback, payload);

      assert(mockEventTarget.dispatchEvent).to.haveBeenCalledWith(Matchers.any(Event));
      const event = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      assert(event['payload']).to.equal(payload);
      assert(<boolean> event.bubbles).to.beTrue();

      assert(mockCallback).to.haveBeenCalledWith();
    });
  });

  describe('dispatchAsync', () => {
    it('should use the event target for dispatching events', async (done: any) => {
      const mockCallback = jasmine.createSpy('Callback');
      mockCallback.and.returnValue(Promise.resolve());
      const eventType = 'eventType';
      const payload = Mocks.object('payload');

      const promise = listenable.dispatchAsync(eventType, mockCallback, payload);

      assert(mockEventTarget.dispatchEvent).toNot.haveBeenCalled();

      await promise;
      assert(mockEventTarget.dispatchEvent).to.haveBeenCalledWith(Matchers.any(Event));
      const event = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      assert(event['payload']).to.equal(payload);
      assert(<boolean> event.bubbles).to.beTrue();

      assert(mockCallback).to.haveBeenCalledWith();
    });
  });

  describe('on', () => {
    it('should listen to the event target correctly', () => {
      const eventType = 'eventType';
      const boundCallback = Mocks.object('boundCallback');
      const mockCallback = jasmine.createSpyObj('Callback', ['bind']);
      mockCallback.bind.and.returnValue(boundCallback);

      const instance = Mocks.object('instance');
      const useCapture = true;

      const disposableFunction = listenable.on(eventType, mockCallback, instance, useCapture);

      assert(mockEventTarget.addEventListener).to
          .haveBeenCalledWith(eventType, boundCallback, useCapture);
      assert(mockCallback.bind).to.haveBeenCalledWith(instance);

      disposableFunction.dispose();
      assert(mockEventTarget.removeEventListener).to
          .haveBeenCalledWith(eventType, boundCallback, useCapture);
    });
  });
});
