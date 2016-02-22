import TestBase from '../test-base';
TestBase.setup();

import DisposableTestSetup from '../testing/disposable-test-setup';
import EventTestSetup from '../testing/event-test-setup';
import ListenableElement, { EventType } from './listenable-element';
import Mocks from '../mock/mocks';


describe('event.ListenableElement', () => {
  let mockElement;
  let element;

  beforeEach(() => {
    mockElement = jasmine.createSpyObj('Element', ['addEventListener', 'removeEventListener']);
    element = new ListenableElement(mockElement);
    DisposableTestSetup.add(element);
  });

  describe('dispose', () => {
    it('should stop listening to events on disposal', () => {
      let eventType = EventType.CLICK;

      DisposableTestSetup.add(element.on(eventType, () => undefined));

      let listener = mockElement.addEventListener.calls.argsFor(0)[1];

      element.dispose();
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', listener);
      expect(mockElement.removeEventListener).not
          .toHaveBeenCalledWith('other', jasmine.any(Function));
    });
  });

  describe('on', () => {
    it('should forward listened events', () => {
      let eventType = EventType.CLICK;
      let mockEvent = Mocks.object('Event');
      mockEvent.type = 'click';

      EventTestSetup.spyOn(element, eventType);

      DisposableTestSetup.add(element.on(eventType, () => undefined));

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
      expect(mockElement.addEventListener).not.toHaveBeenCalledWith('other', jasmine.any(Function));

      // Trigger the DOM event.
      mockElement.addEventListener.calls.argsFor(0)[1](mockEvent);
      expect(EventTestSetup.getPayloads(element, eventType)).toEqual([mockEvent]);
    });

    it('should not forward listened events more than once', () => {
      let eventType = EventType.CLICK;
      let mockEvent = Mocks.object('Event');
      mockEvent.type = 'click';

      EventTestSetup.spyOn(element, eventType);

      DisposableTestSetup.add(
          element.on(eventType, () => undefined),
          element.on(eventType, () => undefined));

      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));

      // Trigger the DOM event.
      mockElement.addEventListener.calls.argsFor(0)[1](mockEvent);
      expect(EventTestSetup.getPayloads(element, eventType)).toEqual([mockEvent]);
    });
  });
});
