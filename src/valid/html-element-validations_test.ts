import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {Validate} from './validate';


describe('valid.HtmlElementValidations', () => {
  describe('to.beNamed', () => {
    it('should pass if the name matches exactly', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).to.beNamed('node-name');
      assert(result.isValid()).to.beTrue();
    });

    it('should pass if the name matches case insensitive way', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).to.beNamed('NODE-name');
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the name does not match', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).to.beNamed('other-name');
      assert(result.isValid()).to.beFalse();
    });
  });

  describe('toNot.beNamed', () => {
    it('should not pass if the name matches exactly', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).toNot.beNamed('node-name');
      assert(result.isValid()).to.beFalse();
    });

    it('should not pass if the name matches case insensitive way', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).toNot.beNamed('NODE-name');
      assert(result.isValid()).to.beFalse();
    });

    it('should pass if the name does not match', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).toNot.beNamed('other-name');
      assert(result.isValid()).to.beTrue();
    });
  });
});
