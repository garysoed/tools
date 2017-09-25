import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { ChildrenListener } from '../persona/children-listener';


describe('persona.childrenListener', () => {
  let mockSelector: any;
  let listener: ChildrenListener<HTMLElement, number>;

  beforeEach(() => {
    mockSelector = jasmine.createSpyObj('Selector', ['getParentSelector']);
    listener = new ChildrenListener(mockSelector);
  });

  describe('onMutation_', () => {
    it(`should call the handlers correctly`, () => {
      const addedNodes1 = Mocks.object('addedNodes1');
      const removedNodes1 = Mocks.object('removedNodes1');
      const record1 = {addedNodes: addedNodes1, removedNodes: removedNodes1};

      const addedNodes2 = Mocks.object('addedNodes2');
      const removedNodes2 = Mocks.object('removedNodes2');
      const record2 = {addedNodes: addedNodes2, removedNodes: removedNodes2};

      const mockHandler = jasmine.createSpy('Handler');
      const context = Mocks.object('context');

      listener['onMutation_'](mockHandler, context, [record1, record2] as any);
      assert(mockHandler).to.haveBeenCalledWith(
          {added: addedNodes1, type: 'childrenchange', removed: removedNodes1});
      assert(mockHandler).to.haveBeenCalledWith(
          {added: addedNodes2, type: 'childrenchange', removed: removedNodes2});
    });
  });

  describe('start', () => {
    it(`should initialize correctly`, () => {
      const root = Mocks.object('root');
      const handler = Mocks.object('handler');
      const context = Mocks.object('context');
      const mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
      const createMutationSpy =
          spyOn(listener, 'createMutationObserver_').and.returnValue(mockObserver);

      const element = document.createElement('div');
      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      mockSelector.getParentSelector.and.returnValue(mockElementSelector);

      spyOn(listener, 'onMutation_');

      const disposable = listener.start(root, handler, context);
      assert(mockObserver.observe).to.haveBeenCalledWith(
          element,
          Matchers.objectContaining({
            childList: true,
          }));
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);

      const records = Mocks.object('records');
      createMutationSpy.calls.argsFor(0)[0](records);
      assert(listener['onMutation_']).to.haveBeenCalledWith(handler, context, records);

      disposable.dispose();
      assert(mockObserver.disconnect).to.haveBeenCalledWith();
    });

    it(`should throw error if the element does not exist`, () => {
      const root = Mocks.object('root');
      const handler = Mocks.object('handler');
      const context = Mocks.object('context');
      const mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
      spyOn(listener, 'createMutationObserver_').and.returnValue(mockObserver);

      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(null);
      mockSelector.getParentSelector.and.returnValue(mockElementSelector);

      assert(() => {
        listener.start(root, handler, context);
      }).to.throwError(/element for/);
    });
  });
});
