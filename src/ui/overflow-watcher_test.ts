import {assert, TestBase} from '../test-base';
TestBase.setup();

import {TestDispose} from '../testing/test-dispose';
import {Doms} from '../ui/doms';
import {Mocks} from '../mock/mocks';
import OverflowWatcher, {EventType, State} from './overflow-watcher';
import {TestEvent} from '../testing/test-event';


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
    assert(mockContainer.addEventListener)
        .to.haveBeenCalledWith('scroll', jasmine.any(Function), false);
  });

  describe('getState_', () => {
    it('should return UNCOVERED if the element is completely visible', () => {
      mockContainer.scrollTop = 20;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(40);

      assert(watcher['getState_']()).to.equal(State.UNCOVERED);
      assert(Doms.relativeOffsetTop).to.haveBeenCalledWith(mockElement, mockContainer);
    });

    it('should return UNCOVERED if the element is just completely visible', () => {
      mockContainer.scrollTop = 20;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(20);

      assert(watcher['getState_']()).to.equal(State.UNCOVERED);
      assert(Doms.relativeOffsetTop).to.haveBeenCalledWith(mockElement, mockContainer);
    });

    it('should return PARTIAL if the element is partially visible', () => {
      mockContainer.scrollTop = 20;
      mockElement.clientHeight = 30;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(10);

      assert(watcher['getState_']()).to.equal(State.PARTIAL);
      assert(Doms.relativeOffsetTop).to.haveBeenCalledWith(mockElement, mockContainer);
    });

    it('should return COVERED if the element is completely invisible', () => {
      mockContainer.scrollTop = 40;
      mockElement.clientHeight = 10;

      spyOn(Doms, 'relativeOffsetTop').and.returnValue(20);

      assert(watcher['getState_']()).to.equal(State.COVERED);
      assert(Doms.relativeOffsetTop).to.haveBeenCalledWith(mockElement, mockContainer);
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
      TestEvent.spyOn(watcher, [EventType.CHANGED]);

      watcher['onScroll_']();

      assert(TestEvent.getPayloads(watcher, EventType.CHANGED)).to.equal([oldState]);
    });

    it('should do nothing if the new state is the same as the old state', () => {
      let oldState = State.COVERED;
      let newState = State.COVERED;

      let spyGetState_ = spyOn(watcher, 'getState_');
      spyGetState_.and.returnValue(oldState);
      watcher.state;

      spyGetState_.and.returnValue(newState);
      TestEvent.spyOn(watcher, [EventType.CHANGED]);

      watcher['onScroll_']();

      assert(TestEvent.getPayloads(watcher, EventType.CHANGED)).to.equal([]);
    });
  });

  describe('get state', () => {
    it('should call getState_ if the state is unknown', () => {
      let state = State.COVERED;
      spyOn(watcher, 'getState_').and.returnValue(state);

      assert(watcher.state).to.equal(state);
      assert(watcher.getState_).to.haveBeenCalledWith();
    });

    it('should cache the output of getState_', () => {
      let state = State.COVERED;
      let spyGetState_ = spyOn(watcher, 'getState_');
      spyGetState_.and.returnValue(state);
      watcher.state;

      spyGetState_.calls.reset();

      assert(watcher.state).to.equal(state);
      assert(watcher.getState_).toNot.haveBeenCalled();
    });
  });
});
