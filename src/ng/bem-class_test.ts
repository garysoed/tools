import TestBase from '../test-base';
TestBase.setup();

import Attributes from '../ui/attributes';
import { BemClassCtrl } from './bem-class';
import FakeScope from '../ng/fake-scope';


describe('ng.BemClassCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new BemClassCtrl();
  });

  describe('onWatchValueChange_', () => {
    let mockAppliedClasses;
    let mockClassPrefix;
    let mockElementClassList;

    beforeEach(() => {
      mockAppliedClasses = [];
      mockClassPrefix = 'CLASS_PREFIX';
      mockElementClassList = jasmine.createSpyObj('ElementClassList', ['add', 'remove']);

      ctrl['appliedClasses_'] = mockAppliedClasses;
      ctrl['classPrefix_'] = mockClassPrefix;
      ctrl['element_'] = { classList: mockElementClassList };
    });

    it('should handle simple strings', () => {
      let newClass = 'newClass';
      let oldClass = 'oldClass';

      mockAppliedClasses.push(oldClass);

      ctrl['onWatchValueChange_'](newClass);

      expect(mockElementClassList.remove).toHaveBeenCalledWith(oldClass);
      expect(mockElementClassList.add).toHaveBeenCalledWith(`${mockClassPrefix}__${newClass}`);
    });

    it('should not remove the old class if it is added', () => {
      let newClass = 'newClass';

      mockAppliedClasses.push(newClass);

      ctrl['onWatchValueChange_'](newClass);

      expect(mockElementClassList.remove).not.toHaveBeenCalled();
    });

    it('should handle array of strings', () => {
      let newClass = 'newClass';
      let existingClass = 'existingClass';
      let oldClass = 'oldClass';

      mockAppliedClasses.push(oldClass);
      mockAppliedClasses.push(existingClass);

      ctrl['onWatchValueChange_']([existingClass, newClass]);

      expect(mockElementClassList.remove).toHaveBeenCalledWith(oldClass);
      expect(mockElementClassList.remove).not.toHaveBeenCalledWith(existingClass);

      expect(mockElementClassList.add).toHaveBeenCalledWith(`${mockClassPrefix}__${newClass}`);
    });

    it('should handle records', () => {
      let newClass = 'newClass';
      let existingClass = 'existingClass';
      let ignoredClass = 'ignoredClass';
      let oldClass = 'oldClass';

      mockAppliedClasses.push(oldClass);
      mockAppliedClasses.push(existingClass);

      ctrl['onWatchValueChange_']({
        [newClass]: true,
        [existingClass]: true,
        [ignoredClass]: false,
      });

      expect(mockElementClassList.remove).toHaveBeenCalledWith(oldClass);
      expect(mockElementClassList.remove).not.toHaveBeenCalledWith(existingClass);

      expect(mockElementClassList.add).toHaveBeenCalledWith(`${mockClassPrefix}__${newClass}`);
      expect(mockElementClassList.add).not
          .toHaveBeenCalledWith(`${mockClassPrefix}__${ignoredClass}`);
    });

    it('should throw error if the value type cannot be handled', () => {
      expect(() => {
        ctrl['onWatchValueChange_'](true);
      }).toThrowError(/Unhandled value/);
    });
  });

  describe('onLink', () => {
    it('should initialize correctly', () => {
      let attrValue = 'attrValue';
      let mock$scope = FakeScope.create();

      let bemRootClass = 'bemRoot';
      let bemRootEl = document.createElement('div');
      Attributes.add('gs-bem-root', bemRootClass, bemRootEl, document);

      let parentEl = document.createElement('div');
      bemRootEl.appendChild(parentEl);

      let el = document.createElement('div');
      parentEl.appendChild(el);

      spyOn(ctrl, 'onWatchValueChange_');
      spyOn(mock$scope, '$watch');

      ctrl.onLink(mock$scope, attrValue, el);

      expect(ctrl['classPrefix_']).toEqual(bemRootClass);
      expect(ctrl['element_']).toEqual(el);

      expect(mock$scope.$watch).toHaveBeenCalledWith(attrValue, jasmine.any(Function));
      mock$scope.$watch.calls.argsFor(0)[1]();
      expect(ctrl['onWatchValueChange_']).toHaveBeenCalledWith();
    });

    it('should throw error if the bem-root cannot be found', () => {
      let el = document.createElement('div');

      expect(() => {
        ctrl.onLink(FakeScope.create(), 'class1 class2', el);
      }).toThrowError(/Cannot find ancestor element/);
    });
  });
});
