import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {Validate} from './validate';


describe('valid.HtmlElementValidations', () => {
  describe('to.beNamed', () => {
    it('should pass if the name matches exactly', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).to.beNamed('node-name');
      expect(result.passes).toEqual(true);
    });

    it('should pass if the name matches case insensitive way', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).to.beNamed('NODE-name');
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the name does not match', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).to.beNamed('other-name');
      expect(result.passes).toEqual(false);
    });
  });

  describe('toNot.beNamed', () => {
    it('should not pass if the name matches exactly', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).toNot.beNamed('node-name');
      expect(result.passes).toEqual(false);
    });

    it('should not pass if the name matches case insensitive way', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).toNot.beNamed('NODE-name');
      expect(result.passes).toEqual(false);
    });

    it('should pass if the name does not match', () => {
      let element = Mocks.object('element');
      element.nodeName = 'node-name';
      let result = Validate.htmlElement(element).toNot.beNamed('other-name');
      expect(result.passes).toEqual(true);
    });
  });
});
