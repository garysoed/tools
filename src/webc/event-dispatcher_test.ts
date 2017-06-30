import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { EventDispatcher } from '../webc/event-dispatcher';

describe('webc.EventDispatcher', () => {
  let mockElement: any;
  let dispatcher: EventDispatcher;

  beforeEach(() => {
    mockElement = jasmine.createSpyObj('Element', ['dispatchEvent']);
    dispatcher = new EventDispatcher(mockElement);
  });

  describe('delete', () => {
    it('should throw error', () => {
      assert(() => {
        dispatcher.delete();
      }).to.throwError(/is unsupported/);
    });
  });

  describe('get', () => {
    it('should return the correct dispatcher', () => {
      const name = 'name';
      const payload = Mocks.object('payload');
      spyOn(EventDispatcher, 'dispatchEvent');

      dispatcher.get()(name, payload);

      assert(EventDispatcher.dispatchEvent).to.haveBeenCalledWith(mockElement, name, payload);
    });
  });

  describe('set', () => {
    it('should throw error', () => {
      assert(() => {
        dispatcher.set(null);
      }).to.throwError(/is unsupported/);
    });
  });

  describe('dispatchEvent', () => {
    it(`should dispatch the event correctly`, async () => {
      const name = 'name';
      const payload = Mocks.object('payload');

      await EventDispatcher.dispatchEvent(mockElement, name, payload);

      assert(mockElement.dispatchEvent).to.haveBeenCalledWith(Matchers.any(CustomEvent));
      const event: CustomEvent = mockElement.dispatchEvent.calls.argsFor(0)[0];
      assert(event.type).to.equal(name);
      assert(event.detail).to.equal(payload);
    });
  });
});

