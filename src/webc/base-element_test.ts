import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';
import {TestListenableDom} from '../testing/test-listenable-dom';


describe('webc.BaseElement', () => {
  let baseElement;

  beforeEach(() => {
    baseElement = new BaseElement();
    TestDispose.add(baseElement);
  });

  describe('getAttribute', () => {
    it('should return the correct value', () => {
      let attrName = 'attrName';
      let value = 'value';
      let eventTarget = Mocks.object('eventTarget');
      eventTarget[attrName] = value;

      let mockElement = jasmine.createSpyObj('Element', ['getEventTarget']);
      mockElement.getEventTarget.and.returnValue(eventTarget);
      baseElement['element_'] = mockElement;

      assert(baseElement.getAttribute(attrName)).to.equal(value);
    });

    it('should return empty string if there are no elements', () => {
      baseElement['element_'] = null;

      assert(baseElement.getAttribute('attrName')).to.equal('');
    });
  });

  describe('onCreated', () => {
    it('should create the listenable element', () => {
      let element = Mocks.object('element');

      baseElement.onCreated(element);

      assert(baseElement.getElement()).to.equal(TestListenableDom.getListenable(element));
    });
  });

  describe('setAttribute', () => {
    it('should set the attribute value correctly', () => {
      let attrName = 'attrName';
      let value = 'value';
      let eventTarget = Mocks.object('eventTarget');

      let mockElement = jasmine.createSpyObj('Element', ['getEventTarget']);
      mockElement.getEventTarget.and.returnValue(eventTarget);
      baseElement['element_'] = mockElement;

      baseElement.setAttribute(attrName, value);

      assert(eventTarget[attrName]).to.equal(value);
    });

    it('should not throw error if there are no elements', () => {
      assert(() => {
        baseElement.setAttribute('attrName', 'value');
      }).toNot.throw();
    });
  });
});
