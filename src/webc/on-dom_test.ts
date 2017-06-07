import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { ATTRIBUTE_CHANGE_HANDLER, EVENT_HANDLER, onDom } from '../webc/on-dom';


describe('webc.onDom', () => {
  describe('attributeChange', () => {
    it('should return the correct decorator', () => {
      const name = 'name';
      const parser = Mocks.object('parser');
      const selector = 'selector';
      const decorator = Mocks.object('decorator');
      spyOn(ATTRIBUTE_CHANGE_HANDLER, 'createDecorator').and.returnValue(decorator);

      assert(onDom.attributeChange({name, parser, selector})).to.equal(decorator);
      assert(ATTRIBUTE_CHANGE_HANDLER.createDecorator).to
          .haveBeenCalledWith(name, parser, selector);
    });
  });

  describe('event', () => {
    it('should return the correct decorator', () => {
      const name = 'name';
      const selector = 'selector';
      const decorator = Mocks.object('decorator');
      spyOn(EVENT_HANDLER, 'createDecorator').and.returnValue(decorator);

      assert(onDom.event(selector, name)).to.equal(decorator);
      assert(EVENT_HANDLER.createDecorator).to.haveBeenCalledWith(name, selector, []);
    });
  });
});
