import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { AssertFactory } from './assert-factory';


describe('jasmine.AssertFactory', () => {
  let mockProvider: any;
  let factory: AssertFactory<any>;

  beforeEach(() => {
    mockProvider = jasmine.createSpy('Provider');
    factory = new AssertFactory(mockProvider);
  });

  describe('to', () => {
    it('should return the provided object without reversal', () => {
      const object = Mocks.object('object');
      mockProvider.and.returnValue(object);

      expect(factory.to).toEqual(object);
      expect(mockProvider).toHaveBeenCalledWith(false);
    });
  });

  describe('toNot', () => {
    it('should return the provided object with reversal', () => {
      const object = Mocks.object('object');
      mockProvider.and.returnValue(object);

      expect(factory.toNot).toEqual(object);
      expect(mockProvider).toHaveBeenCalledWith(true);
    });
  });
});
