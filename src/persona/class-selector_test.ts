import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { ClassSelectorImpl } from '../persona/class-selector';


describe('persona.ClassSelectorImpl', () => {
  const CLASS_NAME = 'className';
  let mockElementSelector: any;
  let selector: ClassSelectorImpl;

  beforeEach(() => {
    mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
    selector = new ClassSelectorImpl(CLASS_NAME, mockElementSelector);
  });

  describe('getValue', () => {
    it(`should return true if the element contains the class name`, () => {
      const root = Mocks.object('root');
      const element = document.createElement('div');
      element.classList.add(CLASS_NAME);
      mockElementSelector.getValue.and.returnValue(element);

      assert(selector.getValue(root)).to.beTrue();
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return false if the element doesn't contain the class name`, () => {
      const root = Mocks.object('root');
      const element = document.createElement('div');
      mockElementSelector.getValue.and.returnValue(element);

      assert(selector.getValue(root)).to.beFalse();
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should return null if the element cannot be found`, () => {
      const root = Mocks.object('root');
      mockElementSelector.getValue.and.returnValue(null);

      assert(selector.getValue(root)).to.be(null);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });
  });

  describe('setValue_', () => {
    it(`should set the class name if the value is true`, () => {
      const root = Mocks.object('root');
      const element = document.createElement('div');
      mockElementSelector.getValue.and.returnValue(element);

      selector['setValue_'](true, root);
      assert(element.classList.contains(CLASS_NAME)).to.beTrue();
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should unset the class name if the value is false`, () => {
      const root = Mocks.object('root');
      const element = document.createElement('div');
      element.classList.add(CLASS_NAME);
      mockElementSelector.getValue.and.returnValue(element);

      selector['setValue_'](false, root);
      assert(element.classList.contains(CLASS_NAME)).to.beFalse();
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should unset the class name if the value is null`, () => {
      const root = Mocks.object('root');
      const element = document.createElement('div');
      element.classList.add(CLASS_NAME);
      mockElementSelector.getValue.and.returnValue(element);

      selector['setValue_'](null, root);
      assert(element.classList.contains(CLASS_NAME)).to.beFalse();
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });

    it(`should not throw if the element cannot be found`, () => {
      const root = Mocks.object('root');
      mockElementSelector.getValue.and.returnValue(null);

      assert(() => {
        selector['setValue_'](null, root);
      }).toNot.throw();
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(root);
    });
  });
});
