import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Avatar } from 'src/avatar';
import { BaseDisposable } from '../dispose';
import { Injector } from '../inject';
import { Templates } from '../webc';


describe('avatar functional test', () => {
  describe('basic usage', () => {
    const TEMPLATE_CONTENT = 'templateContent';

    class TestCtrl extends BaseDisposable { }

    beforeAll(() => {
      const templateKey = 'templateKey';
      Templates.register(templateKey, TEMPLATE_CONTENT);
      Avatar.define({
        ctrl: TestCtrl,
        tag: 'gs-test',
        templateKey,
      });
      Avatar.registerAll(Injector.newInstance(), Templates.newInstance());
    });

    it(`should create the element correctly`, async () => {
      const el = document.createElement('gs-test');
      document.body.appendChild(el);

      assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);
      assert(el.shadowRoot!.innerHTML).to.equal(TEMPLATE_CONTENT);
      el.remove();
    });
  });
});
