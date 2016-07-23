import {TestBase} from '../test-base';
TestBase.setup();

import {DomEvent} from './dom-event';
import {ListenableDom} from './listenable-dom';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';
import {TestEvent} from '../testing/test-event';


describe('event.ListenableDom', () => {
  let mockElement;
  let element;

  beforeEach(() => {
    mockElement = jasmine.createSpyObj('Element', ['addEventListener', 'removeEventListener']);
    element = new ListenableDom(mockElement);
    TestDispose.add(element);
  });

  describe('dispose', () => {
    it('should stop listening to events on disposal', () => {
      let eventType = DomEvent.CLICK;

      TestDispose.add(element.on(eventType, () => undefined));

      let listener = mockElement.addEventListener.calls.argsFor(0)[1];

      element.dispose();
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', listener);
      expect(mockElement.removeEventListener).not
          .toHaveBeenCalledWith('other', jasmine.any(Function));
    });
  });

  describe('on', () => {
    it('should forward listened events', () => {
      let eventType = DomEvent.CLICK;
      let mockEvent = Mocks.object('Event');
      mockEvent.type = 'click';

      TestEvent.spyOn(element, [eventType]);

      TestDispose.add(element.on(eventType, () => undefined));

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
      expect(mockElement.addEventListener).not.toHaveBeenCalledWith('other', jasmine.any(Function));

      // Trigger the DOM event.
      mockElement.addEventListener.calls.argsFor(0)[1](mockEvent);
      expect(TestEvent.getPayloads(element, eventType)).toEqual([mockEvent]);
    });

    it('should not forward listened events more than once', () => {
      let eventType = DomEvent.CLICK;
      let mockEvent = Mocks.object('Event');
      mockEvent.type = 'click';

      TestEvent.spyOn(element, [eventType]);

      TestDispose.add(
          element.on(eventType, () => undefined),
          element.on(eventType, () => undefined));

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));

      // Trigger the DOM event.
      mockElement.addEventListener.calls.argsFor(0)[1](mockEvent);
      expect(TestEvent.getPayloads(element, eventType)).toEqual([mockEvent]);
    });
  });
});
