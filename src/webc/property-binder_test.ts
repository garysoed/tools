import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Mocks} from 'src/mock/mocks';

import {PropertyBinder} from './property-binder';


describe('webc.PropertyBinder', () => {
  const PROPERTY_NAME = 'PROPERTY_NAME';
  let element;
  let binder: PropertyBinder<number>;

  beforeEach(() => {
    element = Mocks.object('element');
    binder = new PropertyBinder<number>(element, PROPERTY_NAME);
  });

  describe('delete', () => {
    it('should set the property to undefined', () => {
      element[PROPERTY_NAME] = 123;
      binder.delete();
      assert(element[PROPERTY_NAME]).toNot.beDefined();
    });
  });

  describe('get', () => {
    it('should return the property value', () => {
      let value = 123;
      element[PROPERTY_NAME] = value;
      assert(binder.get()).to.equal(value);
    });
  });

  describe('set', () => {
    it('should set the property value', () => {
      let value = 123;
      binder.set(value);
      assert(element[PROPERTY_NAME]).to.equal(value);
    });
  });
});
