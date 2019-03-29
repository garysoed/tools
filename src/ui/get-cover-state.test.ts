import { assert, should, test } from '@gs-testing/main';
import { mocks } from '@gs-testing/mock';
import { createSpyObject, fake, spy, SpyObj } from '@gs-testing/spy';
import { Doms } from './doms';
import { getCoverState, State } from './get-cover-state';


test('ui.getCoverState', () => {
  let mockContainer: SpyObj<HTMLElement>;
  let mockElement: any;

  beforeEach(() => {
    mockContainer = createSpyObject('Container', ['addEventListener', 'removeEventListener']);
    mockElement = mocks.object('Element');
    mockElement.offsetParent = null;
  });

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
