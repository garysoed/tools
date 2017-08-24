import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Avatar, component } from '../avatar';
import { BaseDisposable } from '../dispose';
import { Injector } from '../inject';
import { Templates } from '../webc';


describe('avatar functional test', () => {
  describe('basic usage without annotations', () => {
    const TEMPLATE_CONTENT = 'templateContent';

    class TestCtrl extends BaseDisposable { }

    beforeAll(() => {
      const templateKey = 'templateKey1';
      Templates.register(templateKey, TEMPLATE_CONTENT);
      Avatar.define({
        ctrl: TestCtrl,
        tag: 'gs-test-1',
        templateKey,
      });
      Avatar.registerAll(Injector.newInstance(), Templates.newInstance());
    });

    it(`should create the element correctly`, async () => {
      const el = document.createElement('gs-test-1');
      document.body.appendChild(el);

      assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);
      assert(el.shadowRoot!.innerHTML).to.equal(TEMPLATE_CONTENT);
      el.remove();
    });
  });

  describe('basic usage with annotations', () => {
    const TEMPLATE_CONTENT = 'templateContent';
    const TEMPLATE_KEY = 'templateKey2';
    Templates.register(TEMPLATE_KEY, TEMPLATE_CONTENT);

    @component({
      tag: 'gs-test-2',
      templateKey: TEMPLATE_KEY,
    })
    class TestCtrl extends BaseDisposable { }

    beforeAll(() => {
      Avatar.registerAll(Injector.newInstance(), Templates.newInstance());
    });

    it(`should create the element correctly`, async () => {
      const el = document.createElement('gs-test-2');
      document.body.appendChild(el);

      assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);
      assert(el.shadowRoot!.innerHTML).to.equal(TEMPLATE_CONTENT);
      el.remove();
    });
  });
});
