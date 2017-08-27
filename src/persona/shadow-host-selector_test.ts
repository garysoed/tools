import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { shadowHostSelector } from '../persona';

describe('persona.shadowHostSelector ', () => {
  describe('getValue', () => {
    it(`should return the shadow host correctly`, () => {
      const element = document.createElement('div');
      const root = element.attachShadow({mode: 'open'});
      assert(shadowHostSelector.getValue(root)).to.equal(element);
    });

    it(`should throw error if the host is not the correct type`, () => {
      const root = Mocks.object('root');
      assert(() => {
        shadowHostSelector.getValue(root);
      }).to.throwError(/host has the wrong type/);
    });
  });
});
