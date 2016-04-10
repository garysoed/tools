import TestBase from '../test-base';
TestBase.setup();

import AssertsFactory from './asserts-factory';


class FakeAsserts {
  private reversed_: boolean;

  constructor(reversed: boolean) {
    this.reversed_ = reversed;
  }

  get reversed(): boolean {
    return this.reversed_;
  }
}

describe('assert.AssertsFactory', () => {
  let factory;

  beforeEach(() => {
    factory = new AssertsFactory(FakeAsserts);
  });

  describe('to', () => {
    it('should generate a new assert with normal assertion logic', () => {
      expect(factory.to.reversed).toEqual(false);
    });
  });

  describe('toNot', () => {
    it('should generate a new assert with reversed assertion logic', () => {
      expect(factory.toNot.reversed).toEqual(true);
    });
  });
});
