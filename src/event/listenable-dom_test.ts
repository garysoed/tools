import { assert, Match, TestBase } from 'gs-testing/export/main';


import { TestDispose } from '../testing/test-dispose';

import { mockObject } from 'gs-testing/export/mock';
import { ListenableDom } from './listenable-dom';

describe('event.ListenableDom', () => {
  let mockEventTarget: any;
  let listenable: ListenableDom<any>;

  beforeEach(() => {
    mockEventTarget = createSpyObject(
        'EventTarget',
        ['addEventListener', 'dispatchEvent', 'removeEventListener']);
    listenable = new ListenableDom(mockEventTarget);
    TestDispose.add(listenable);
  });

  describe('dispatch', () => {
    should('use the event target for dispatching events', () => {
      const mockCallback = createSpy('Callback');
      const eventType = 'eventType';
      const payload = mockObject('payload');

      listenable.dispatch(eventType, mockCallback, payload);

      assert(mockEventTarget.dispatchEvent).to.haveBeenCalledWith(Match.any(Event));
      const event = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      assert(event['payload']).to.equal(payload);
      assert(event.bubbles as boolean).to.beTrue();

      assert(mockCallback).to.haveBeenCalledWith();
    });
  });

  describe('dispatchAsync', () => {
    should('use the event target for dispatching events', async () => {
      const mockCallback = createSpy('Callback');
      mockCallback.and.returnValue(Promise.resolve());
      const eventType = 'eventType';
      const payload = mockObject('payload');

      const promise = listenable.dispatchAsync(eventType, mockCallback, payload);

      assert(mockEventTarget.dispatchEvent).toNot.haveBeenCalled();

      await promise;
      assert(mockEventTarget.dispatchEvent).to.haveBeenCalledWith(Match.any(Event));
      const event = mockEventTarget.dispatchEvent.calls.argsFor(0)[0];
      assert(event['payload']).to.equal(payload);
      assert(event.bubbles as boolean).to.beTrue();

      assert(mockCallback).to.haveBeenCalledWith();
    });
  });

  describe('on', () => {
    should('listen to the event target correctly', () => {
      const eventType = 'eventType';
      const boundCallback = mockObject('boundCallback');
      const mockCallback = createSpyObject('Callback', ['bind']);
      mockCallback.bind.and.returnValue(boundCallback);

      const instance = mockObject('instance');
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
