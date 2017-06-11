import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { ElementBinder } from '../webc/element-binder';


describe('webc.ElementBinder', () => {
  let element: any;
  let binder: ElementBinder<Element>;

  beforeEach(() => {
    element = Mocks.object('element');
    binder = new ElementBinder<Element>(element);
  });

  describe('delete', () => {
    it('should throw error', () => {
      assert(() => {
        binder.delete();
      }).to.throwError(/unsupported/);
    });
  });

  describe('get', () => {
    it('should return the correct element', () => {
      assert(binder.get()).to.equal(element);
    });
  });

  describe('set', () => {
    it('should throw error', () => {
      assert(() => {
        binder.set(Mocks.object('element2'));
      }).to.throwError(/unsupported/);
    });
  });
});
