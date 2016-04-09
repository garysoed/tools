import TestBase from '../test-base';
TestBase.setup();

import AssertsFactory from './asserts-factory';


class FakeAsserts {
  private reversed_: boolean;

  constructor(reversed: boolean) {
    this.reversed_ = reversed;
  }

  get reversed() {
    return this.reversed_;
  }
}

describe('assert.AssertsFactory', () => {
  let factory;

  beforeEach(() => {
    factory = new AssertsFactory(FakeAsserts);
  });

  describe('is', () => {
    it('should generate a new assert with normal assertion logic', () => {
      expect(factory.is.reversed).toEqual(false);
    });
  });

  describe('isNot', () => {
    it('should generate a new assert with reversed assertion logic', () => {
      expect(factory.isNot.reversed).toEqual(true);
    });
  });
});
