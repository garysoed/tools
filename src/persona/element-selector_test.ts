import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InstanceofType } from '../check';
import {
  elementSelector,
  ElementSelectorImpl,
  ElementSelectorStub } from '../persona/element-selector';

function getShadowRoot(): ShadowRoot {
  return document.body.shadowRoot || document.body.attachShadow({mode: 'open'});
}

describe('avatar.ElementSelectorStub', () => {
  describe('resolve', () => {
    it(`should return the correct selector`, () => {
      const impl = elementSelector('selector', InstanceofType(HTMLDivElement));
      const stub = elementSelector('a.b') as ElementSelectorStub<HTMLDivElement>;
      const json = {a: {b: impl}};

      assert(stub.resolve(json)).to.equal(impl);
    });

    it(`should throw error if the selector is the wrong type`, () => {
      const stub = elementSelector('a.b') as ElementSelectorStub<HTMLDivElement>;
      const json = {a: {b: 123}};

      assert(() => {
        stub.resolve(json);
      }).to.throwError(/Cannot resolve/);
    });

    it(`should throw error if the selector cannot be found`, () => {
      const stub = elementSelector('a.b') as ElementSelectorStub<HTMLDivElement>;

      assert(() => {
        stub.resolve({});
      }).to.throwError(/Cannot resolve/);
    });
  });
});

describe('avatar.ElementSelectorImpl', () => {
  describe('getValue', () => {
    it(`should return the correct value`, () => {
      const selector = '#root';
      const element = document.createElement('div');
      element.id = 'root';

      const shadowRoot = getShadowRoot();
      shadowRoot.appendChild(element);

      const impl = elementSelector(
          selector, InstanceofType(HTMLDivElement)) as ElementSelectorImpl<HTMLDivElement>;

      assert(impl.getValue(shadowRoot)).to.equal(element);

      element.remove();
    });

    it(`should throw error if the element is the wrong type`, () => {
      const selector = '#root';
      const element = document.createElement('a');
      element.id = 'root';

      const shadowRoot = getShadowRoot();
      shadowRoot.appendChild(element);

      const impl = elementSelector(
          selector, InstanceofType(HTMLDivElement)) as ElementSelectorImpl<HTMLDivElement>;

      assert(() => {
        impl.getValue(shadowRoot);
      }).to.throwError(/wrong type/);

      element.remove();
    });
  });
});
