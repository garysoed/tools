import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { elementSelector, innerTextSelector } from '../avatar';
import { ElementSelectorImpl } from '../avatar/element-selector';
import { InnerTextSelectorStub } from '../avatar/inner-text-selector';
import { NumberType } from '../check';
import { IntegerParser } from '../parse';

function getShadowRoot(): ShadowRoot {
  return document.body.shadowRoot || document.body.attachShadow({mode: 'open'});
}

describe('avatar.InnerTextSelectorStub', () => {
  describe('resolve', () => {
    it(`should resolve correctly`, () => {
      const mockElementSelectorImpl = jasmine.createSpyObj('ElementSelectorImpl', ['getSelector']);
      const mockElementSelector = elementSelector<HTMLElement>('path');
      const resolveSpy = spyOn(mockElementSelector, 'resolve').and
          .returnValue(mockElementSelectorImpl);

      const parser = Mocks.object('parser');
      const type = Mocks.object('type');
      const stub = innerTextSelector(mockElementSelector, parser, type) as
          InnerTextSelectorStub<number>;
      const all = Mocks.object('all');

      assert(stub.resolve(all).getElementSelector()).to.equal(mockElementSelectorImpl);
      assert(resolveSpy).to.haveBeenCalledWith(all);
    });
  });
});

describe('avatar.InnerTextSelectorImpl', () => {
  describe('getValue', () => {
    it(`should return the value correctly`, () => {
      const element = document.createElement('div');
      element.innerText = '123';
      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const impl = innerTextSelector(mockElementSelector, IntegerParser, NumberType);
      const shadowRoot = getShadowRoot();

      assert(impl.getValue(shadowRoot)).to.equal(123);
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(shadowRoot);
    });
  });

  describe('setValue', () => {
    it(`should set the value correctly`, () => {
      const element = document.createElement('div');
      const mockElementSelector = jasmine.createSpyObj('ElementSelector', ['getValue']);
      mockElementSelector.getValue.and.returnValue(element);
      Object.setPrototypeOf(mockElementSelector, ElementSelectorImpl.prototype);

      const impl = innerTextSelector(mockElementSelector, IntegerParser, NumberType);
      const shadowRoot = getShadowRoot();

      impl.setValue(123, shadowRoot);
      assert(element.innerText).to.equal('123');
      assert(mockElementSelector.getValue).to.haveBeenCalledWith(shadowRoot);
    });
  });
});
