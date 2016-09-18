import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {ValidationsFactory} from './validations-factory';


describe('valid.ValidationsFactory', () => {
  let mockProvider;
  let factory;

  beforeEach(() => {
    mockProvider = jasmine.createSpy('Provider');
    factory = new ValidationsFactory(mockProvider);
  });

  describe('to', () => {
    it('should generate a new validations with normal validations logic', () => {
      let mockValidations = Mocks.object('Validations');
      mockProvider.and.returnValue(mockValidations);

      assert(factory.to).to.equal(mockValidations);
      assert(mockProvider).to.haveBeenCalledWith(false);
    });
  });

  describe('toNot', () => {
    it('should generate a new assert with reversed assertion logic', () => {
      let mockValidations = Mocks.object('Validations');
      mockProvider.and.returnValue(mockValidations);

      assert(factory.toNot).to.equal(mockValidations);
      assert(mockProvider).to.haveBeenCalledWith(true);
    });
  });
});
