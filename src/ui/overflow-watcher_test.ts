import TestBase from '../test-base';
TestBase.setup();

import TestDispose from '../testing/test-dispose';
import Doms from '../ui/doms';
import TestEvent from '../testing/test-event';
import Mocks from '../mock/mocks';
import OverflowWatcher, { EventType, State } from './overflow-watcher';


describe('ui.OverflowWatcher', () => {
  let mockContainer;
  let mockElement;
  let watcher;

  beforeEach(() => {
    mockContainer = jasmine.createSpyObj('Container', ['addEventListener', 'removeEventListener']);
    mockElement = Mocks.object('Element');
    mockElement.offsetParent = null;

    watcher = new OverflowWatcher(mockContainer, mockElement);
    TestDispose.add(watcher);
  });

  it('should initialize correctly', () => {
    expect(mockContainer.addEventListener).toHaveBeenCalledWith('scroll', jasmine.any(Function));
  });

  describe('getState_', () => {
    it('should return UNCOVERED if the element is completely visible', () => {
      mockContainer.scrollTop = 20;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(40);

      expect(watcher['getState_']()).toEqual(State.UNCOVERED);
      expect(Doms.relativeOffsetTop).toHaveBeenCalledWith(mockElement, mockContainer);
    });

    it('should return UNCOVERED if the element is just completely visible', () => {
      mockContainer.scrollTop = 20;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(20);

      expect(watcher['getState_']()).toEqual(State.UNCOVERED);
      expect(Doms.relativeOffsetTop).toHaveBeenCalledWith(mockElement, mockContainer);
    });

    it('should return PARTIAL if the element is partially visible', () => {
      mockContainer.scrollTop = 20;
      mockElement.clientHeight = 30;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(10);

      expect(watcher['getState_']()).toEqual(State.PARTIAL);
      expect(Doms.relativeOffsetTop).toHaveBeenCalledWith(mockElement, mockContainer);
    });

    it('should return COVERED if the element is completely invisible', () => {
      mockContainer.scrollTop = 40;
      mockElement.clientHeight = 10;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(20);

      expect(watcher['getState_']()).toEqual(State.COVERED);
      expect(Doms.relativeOffsetTop).toHaveBeenCalledWith(mockElement, mockContainer);
    });
  });

  describe('onScroll_', () => {
    it('should dispatch changed event if the new state is different from the old state', () => {
      let oldState = State.COVERED;
      let newState = State.PARTIAL;

      let spyGetState_ = spyOn(watcher, 'getState_');
      spyGetState_.and.returnValue(oldState);
      watcher.state;

      spyGetState_.and.returnValue(newState);
      TestEvent.spyOn(watcher);

      watcher['onScroll_']();

      expect(TestEvent.getPayloads(watcher, EventType.CHANGED)).toEqual([oldState]);
    });

    it('should do nothing if the new state is the same as the old state', () => {
      let oldState = State.COVERED;
      let newState = State.COVERED;

      let spyGetState_ = spyOn(watcher, 'getState_');
      spyGetState_.and.returnValue(oldState);
      watcher.state;

      spyGetState_.and.returnValue(newState);
      TestEvent.spyOn(watcher);

      watcher['onScroll_']();

      expect(TestEvent.getPayloads(watcher, EventType.CHANGED)).toEqual([]);
    });
  });

  describe('get state', () => {
    it('should call getState_ if the state is unknown', () => {
      let state = State.COVERED;
      spyOn(watcher, 'getState_').and.returnValue(state);

      expect(watcher.state).toEqual(state);
      expect(watcher.getState_).toHaveBeenCalledWith();
    });

    it('should cache the output of getState_', () => {
      let state = State.COVERED;
      let spyGetState_ = spyOn(watcher, 'getState_');
      spyGetState_.and.returnValue(state);
      watcher.state;

      spyGetState_.calls.reset();

      expect(watcher.state).toEqual(state);
      expect(watcher.getState_).not.toHaveBeenCalled();
    });
  });
});
