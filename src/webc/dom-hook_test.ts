import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {DomHook} from './dom-hook';


describe('webc.DomHook', () => {
  let hook: DomHook<string>;

  beforeEach(() => {
    hook = new DomHook<string>(true /* deleteOnFalsy */);
  });

  describe('delete', () => {
    it('should delete the DOM location', () => {
      let mockBinder = jasmine.createSpyObj('Binder', ['delete']);
      hook['binder_'] = mockBinder;
      hook.delete();
      assert(mockBinder.delete).to.haveBeenCalledWith();
    });

    it('should throw error if open has not been called', () => {
      hook['binder_'] = null;
      assert(() => {
        hook.delete();
      }).to.throwError(/"open" has not been called/);
    });
  });

  describe('get', () => {
    it('should return the correct value', () => {
      let value = 'value';
      let mockBinder = jasmine.createSpyObj('Binder', ['get']);
      mockBinder.get.and.returnValue(value);
      hook['binder_'] = mockBinder;

      assert(hook.get()).to.equal(value);
    });

    it('should throw error if open has not been called', () => {
      hook['binder_'] = null;
      assert(() => {
        hook.get();
      }).to.throwError(/"open" has not been called/);
    });
  });

  describe('open', () => {
    it('should set the binder correctly', () => {
      let binder = Mocks.object('binder');
      hook['binder_'] = null;
      hook.open(binder);
      assert(hook['binder_']).to.equal(binder);
    });

    it('should throw error if open has been called', () => {
      hook['binder_'] = Mocks.object('binder');
      assert(() => {
        hook.open(Mocks.object('otherBinder'));
      }).to.throwError(/"open" should not have been called/);
    });
  });

  describe('set', () => {
    it('should set the value correctly', () => {
      let mockBinder = jasmine.createSpyObj('Binder', ['set']);
      hook['binder_'] = mockBinder;

      let value = Mocks.object('value');
      hook.set(value);
      assert(mockBinder.set).to.haveBeenCalledWith(value);
    });

    it('should delete the DOM location if the value is falsy and deleteOnFalsy is set', () => {
      let mockBinder = jasmine.createSpyObj('Binder', ['set']);
      hook['binder_'] = mockBinder;
      hook['deleteOnFalsy_'] = true;

      spyOn(hook, 'delete');

      hook.set('');
      assert(hook.delete).to.haveBeenCalledWith();
      assert(mockBinder.set).toNot.haveBeenCalled();
    });

    it('should not delete the DOM location if the value is falsy and deleteOnFalsy is not set',
        () => {
          let mockBinder = jasmine.createSpyObj('Binder', ['set']);
          hook['binder_'] = mockBinder;
          hook['deleteOnFalsy_'] = false;

          spyOn(hook, 'delete');

          hook.set('');
          assert(hook.delete).toNot.haveBeenCalledWith();
        });

    it('should not delete the DOM location if the value is truthy and deleteOnFalsy is set',
        () => {
          let mockBinder = jasmine.createSpyObj('Binder', ['set']);
          hook['binder_'] = mockBinder;
          hook['deleteOnFalsy_'] = true;

          spyOn(hook, 'delete');

          hook.set('vallue');
          assert(hook.delete).toNot.haveBeenCalledWith();
        });

    it('should throw error if open has not been called', () => {
      hook['binder_'] = null;
      assert(() => {
        hook.set('value');
      }).to.throwError(/"open" has not been called/);
    });
  });
});
