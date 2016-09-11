import {assert, TestBase, verify, verifyNever, verifyNoCalls} from '../test-base';
TestBase.setup();

import {Attributes} from '../ui/attributes';
import {BemClassCtrl} from './bem-class';
import FakeScope from '../ng/fake-scope';
import {TestDispose} from '../testing/test-dispose';


describe('ng.BemClassCtrl', () => {
  let ctrl;

  beforeEach(() => {
    ctrl = new BemClassCtrl();
    TestDispose.add(ctrl);
  });

  describe('onWatchValueChange_', () => {
    let mockAppliedClasses;
    let mockClassPrefix;
    let mockElementClassList: DOMTokenList;

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

      verify(mockElementClassList.remove)(oldClass);
      verify(mockElementClassList.add)(`${mockClassPrefix}__${newClass}`);
    });

    it('should not remove the old class if it is added', () => {
      let newClass = 'newClass';

      mockAppliedClasses.push(newClass);

      ctrl['onWatchValueChange_'](newClass);

      verifyNoCalls(mockElementClassList.remove);
    });

    it('should handle array of strings', () => {
      let newClass = 'newClass';
      let existingClass = 'existingClass';
      let oldClass = 'oldClass';

      mockAppliedClasses.push(oldClass);
      mockAppliedClasses.push(existingClass);

      ctrl['onWatchValueChange_']([existingClass, newClass]);

      verify(mockElementClassList.remove)(oldClass);
      verifyNever(mockElementClassList.remove)(existingClass);

      verify(mockElementClassList.add)(`${mockClassPrefix}__${newClass}`);
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

      verify(mockElementClassList.remove)(oldClass);
      verifyNever(mockElementClassList.remove)(existingClass);

      verify(mockElementClassList.add)(`${mockClassPrefix}__${newClass}`);
      verifyNever(mockElementClassList.add)(`${mockClassPrefix}__${ignoredClass}`);
    });

    it('should throw error if the value type cannot be handled', () => {
      assert(() => {
        ctrl['onWatchValueChange_'](true);
      }).to.throwError(/Unhandled value/);
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
      spyOn(mock$scope, '$watch').and.callThrough();

      ctrl.onLink(mock$scope, attrValue, el);

      assert(ctrl['classPrefix_']).to.equal(bemRootClass);
      assert(ctrl['element_']).to.equal(el);

      verify(mock$scope.$watch)(attrValue, jasmine.any(Function));
      mock$scope.$watch.calls.argsFor(0)[1]();
      verify(ctrl['onWatchValueChange_'])();
    });

    it('should throw error if the bem-root cannot be found', () => {
      let el = document.createElement('div');

      assert(() => {
        ctrl.onLink(FakeScope.create(), 'class1 class2', el);
      }).to.throwError(/Cannot find ancestor element/);
    });
  });
});
