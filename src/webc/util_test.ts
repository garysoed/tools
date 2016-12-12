import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {Util} from './util';


describe('webc.Util', () => {
  describe('resolveSelector', () => {
    it('should return the correct element if selector is specified', () => {
      let targetEl = Mocks.object('targetEl');
      let mockShadowRoot = jasmine.createSpyObj('ShadowRoot', ['querySelector']);
      mockShadowRoot.querySelector.and.returnValue(targetEl);

      let selector = 'selector';
      let element = Mocks.object('element');
      element.shadowRoot = mockShadowRoot;

      assert(Util.resolveSelector(selector, element)).to.equal(targetEl);
      assert(mockShadowRoot.querySelector).to.haveBeenCalledWith(selector);
    });

    it('should create the root element when the selector is null', () => {
      let element = Mocks.object('element');

      assert(Util.resolveSelector(null, element)).to.equal(element);
    });
  });
});
