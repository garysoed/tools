import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { AttributeChangeListener } from '../persona/attribute-change-listener';


describe('persona.AttributeChangeListener', () => {
  let mockSelector: any;
  let listener: AttributeChangeListener<number>;

  beforeEach(() => {
    mockSelector = jasmine.createSpyObj('Selector', ['getElementSelector', 'getName']);
    listener = new AttributeChangeListener(mockSelector);
  });

  describe('onMutation_', () => {
    it(`should call the handlers correctly`, () => {
      const attributeName1 = 'attributeName1';
      const oldValue1 = 'oldValue1';
      const target1 = document.createElement('div');
      target1.setAttribute(attributeName1, oldValue1);
      const record1 = {attributeName: attributeName1, oldValue: oldValue1, target: target1};

      const attributeName2 = 'attributeName2';
      const oldValue2 = Mocks.object('oldValue2');
      const target2 = Mocks.object('target2');
      const record2 = {attributeName: attributeName2, oldValue: oldValue2, target: target2};

      const oldValue3 = Mocks.object('oldValue3');
      const target3 = document.createElement('div');
      const record3 = {attributeName: null, oldValue: oldValue3, target: target3};

      const attributeName4 = 'attributeName4';
      const oldValue4 = Mocks.object('oldValue4');
      const target4 = document.createElement('div');
      const record4 = {attributeName: attributeName4, oldValue: oldValue4, target: target4};

      const mockHandler = jasmine.createSpy('Handler');
      const context = Mocks.object('context');

      listener['onMutation_'](mockHandler, context, [record1, record2, record3, record4] as any);
      assert(mockHandler).to.haveBeenCalledWith({oldValue: oldValue4, type: 'change'});
      assert(mockHandler).toNot.haveBeenCalledWith({oldValue: oldValue1, type: 'change'});
      assert(mockHandler).toNot.haveBeenCalledWith({oldValue: oldValue2, type: 'change'});
      assert(mockHandler).toNot.haveBeenCalledWith({oldValue: oldValue3, type: 'change'});
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
      mockSelector.getElementSelector.and.returnValue(mockElementSelector);

      const attrName = 'attrName';
      mockSelector.getName.and.returnValue(attrName);

      spyOn(listener, 'onMutation_');

      const disposable = listener.start(root, handler, context);
      assert(mockObserver.observe).to.haveBeenCalledWith(
          element,
          Matchers.objectContaining({
            attributeFilter: [attrName],
          }));
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);

      const records = Mocks.object('records');
      createMutationSpy.calls.argsFor(0)[0](records);
      assert(listener['onMutation_']).to.haveBeenCalledWith(handler, context, records);

      disposable.dispose();
      assert(mockObserver.disconnect).to.haveBeenCalledWith();
    });
  });
});
