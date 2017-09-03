import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { ElementWithTagType } from '../check';


describe('check.ElementWithTagType', () => {
  describe('check', () => {
    it(`should return true if the target is an element with the correct tag name`, () => {
      const element = document.createElement('input');

      assert(ElementWithTagType('INPUT').check(element)).to.beTrue();
    });

    it(`should return true if the target is an element with the correct tag name with different ` +
        `case`, () => {
      const element = document.createElement('input');

      assert(ElementWithTagType('input').check(element)).to.beTrue();
    });

    it(`should return false if the target is an element with the wrong tag name`, () => {
      const element = document.createElement('input');

      assert(ElementWithTagType('div').check(element)).to.beFalse();
    });

    it(`should return false if the target is not an HTMLElement`, () => {
      const element = Mocks.object('element');

      assert(ElementWithTagType('div').check(element)).to.beFalse();
    });
  });
});
