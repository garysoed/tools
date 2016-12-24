import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Mocks} from 'src/mock/mocks';

import {DomBridge} from './dom-bridge';


describe('webc.DomBridge', () => {
  let bridge: DomBridge<string>;

  beforeEach(() => {
    bridge = new DomBridge<string>(true /* deleteOnFalsy */);
  });

  describe('delete', () => {
    it('should delete the DOM location', () => {
      let mockBinder = jasmine.createSpyObj('Binder', ['delete']);
      bridge['binder_'] = mockBinder;
      bridge.delete();
      assert(mockBinder.delete).to.haveBeenCalledWith();
    });

    it('should throw error if open has not been called', () => {
      bridge['binder_'] = null;
      assert(() => {
        bridge.delete();
      }).to.throwError(/"open" has not been called/);
    });
  });

  describe('get', () => {
    it('should return the correct value', () => {
      let value = 'value';
      let mockBinder = jasmine.createSpyObj('Binder', ['get']);
      mockBinder.get.and.returnValue(value);
      bridge['binder_'] = mockBinder;

      assert(bridge.get()).to.equal(value);
    });

    it('should throw error if open has not been called', () => {
      bridge['binder_'] = null;
      assert(() => {
        bridge.get();
      }).to.throwError(/"open" has not been called/);
    });
  });

  describe('open', () => {
    it('should set the binder correctly', () => {
      let binder = Mocks.object('binder');
      bridge['binder_'] = null;
      bridge.open(binder);
      assert(bridge['binder_']).to.equal(binder);
    });

    it('should throw error if open has been called', () => {
      bridge['binder_'] = Mocks.object('binder');
      assert(() => {
        bridge.open(Mocks.object('otherBinder'));
      }).to.throwError(/"open" should not have been called/);
    });
  });

  describe('set', () => {
    it('should set the value correctly', () => {
      let mockBinder = jasmine.createSpyObj('Binder', ['set']);
      bridge['binder_'] = mockBinder;

      let value = Mocks.object('value');
      bridge.set(value);
      assert(mockBinder.set).to.haveBeenCalledWith(value);
    });

    it('should delete the DOM location if the value is falsy and deleteOnFalsy is set', () => {
      let mockBinder = jasmine.createSpyObj('Binder', ['set']);
      bridge['binder_'] = mockBinder;
      bridge['deleteOnFalsy_'] = true;

      spyOn(bridge, 'delete');

      bridge.set('');
      assert(bridge.delete).to.haveBeenCalledWith();
      assert(mockBinder.set).toNot.haveBeenCalled();
    });

    it('should not delete the DOM location if the value is falsy and deleteOnFalsy is not set',
        () => {
          let mockBinder = jasmine.createSpyObj('Binder', ['set']);
          bridge['binder_'] = mockBinder;
          bridge['deleteOnFalsy_'] = false;

          spyOn(bridge, 'delete');

          bridge.set('');
          assert(bridge.delete).toNot.haveBeenCalledWith();
        });

    it('should not delete the DOM location if the value is truthy and deleteOnFalsy is set',
        () => {
          let mockBinder = jasmine.createSpyObj('Binder', ['set']);
          bridge['binder_'] = mockBinder;
          bridge['deleteOnFalsy_'] = true;

          spyOn(bridge, 'delete');

          bridge.set('vallue');
          assert(bridge.delete).toNot.haveBeenCalledWith();
        });

    it('should throw error if open has not been called', () => {
      bridge['binder_'] = null;
      assert(() => {
        bridge.set('value');
      }).to.throwError(/"open" has not been called/);
    });
  });
});
