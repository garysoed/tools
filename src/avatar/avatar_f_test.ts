import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Avatar } from 'src/avatar';
import { BaseDisposable } from '../dispose';
import { Injector } from '../inject';


describe('avatar functional test', () => {
  describe('basic usage', () => {
    class TestCtrl extends BaseDisposable { }

    beforeAll(() => {
      Avatar.define({
        ctrl: TestCtrl,
        tag: 'gs-test',
        templateKey: 'template',
      });
      Avatar.registerAll(Injector.newInstance());
    });

    it(`should create the element correctly`, async () => {
      const el = document.createElement('gs-test');
      document.body.appendChild(el);
      assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);
      el.remove();
    });
  });
});
