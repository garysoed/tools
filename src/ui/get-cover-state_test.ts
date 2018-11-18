import { assert, match, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpyObject, fake, spy, SpyObj } from 'gs-testing/export/spy';
import { Doms } from '../ui/doms';
import { getCoverState, State } from './get-cover-state';


describe('ui.OverflowWatcher', () => {
  let mockContainer: SpyObj<HTMLElement>;
  let mockElement: any;

  beforeEach(() => {
    mockContainer = createSpyObject('Container', ['addEventListener', 'removeEventListener']);
    mockElement = mocks.object('Element');
    mockElement.offsetParent = null;
  });

  should('initialize correctly', () => {
    assert(mockContainer.addEventListener).to.haveBeenCalledWith(
        'scroll',
        match.anyThat<(evt: Event) => void>().beAFunction(), false);
  });

  describe('getState', () => {
    should('return UNCOVERED if the element is completely visible', () => {
      mockContainer.scrollTop = 20;

      const relativeOffsetTopSpy = spy(Doms, 'relativeOffsetTop');
      fake(relativeOffsetTopSpy).always().return(40);

      assert(getCoverState(mockContainer, mockElement)).to.equal(State.UNCOVERED);
      assert(relativeOffsetTopSpy).to.haveBeenCalledWith(mockElement, mockContainer);
    });

    should('return UNCOVERED if the element is just completely visible', () => {
      mockContainer.scrollTop = 20;

      const relativeOffsetTopSpy = spy(Doms, 'relativeOffsetTop');
      fake(relativeOffsetTopSpy).always().return(20);

      assert(getCoverState(mockContainer, mockElement)).to.equal(State.UNCOVERED);
      assert(relativeOffsetTopSpy).to.haveBeenCalledWith(mockElement, mockContainer);
    });

    should('return PARTIAL if the element is partially visible', () => {
      mockContainer.scrollTop = 20;
      mockElement.clientHeight = 30;

      const relativeOffsetTopSpy = spy(Doms, 'relativeOffsetTop');
      fake(relativeOffsetTopSpy).always().return(10);

      assert(getCoverState(mockContainer, mockElement)).to.equal(State.PARTIAL);
      assert(relativeOffsetTopSpy).to.haveBeenCalledWith(mockElement, mockContainer);
    });

    should('return COVERED if the element is completely invisible', () => {
      mockContainer.scrollTop = 40;
      mockElement.clientHeight = 10;

      const relativeOffsetTopSpy = spy(Doms, 'relativeOffsetTop');
      fake(relativeOffsetTopSpy).always().return(20);

      assert(getCoverState(mockContainer, mockElement)).to.equal(State.COVERED);
      assert(relativeOffsetTopSpy).to.haveBeenCalledWith(mockElement, mockContainer);
    });
  });
});
