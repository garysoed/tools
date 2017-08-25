import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Avatar, component, elementSelector, innerTextSelector, resolveSelectors } from '../avatar';
import { InstanceofType, NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Graph } from '../graph';
import { Injector } from '../inject';
import { IntegerParser } from '../parse';
import { Templates } from '../webc';


describe('avatar functional test', () => {
  describe('without annotations', () => {
    const TEMPLATE_CONTENT = '<div id="root"></div>';
    const $ = resolveSelectors({
      root: {
        element: elementSelector('#root', InstanceofType(HTMLElement)),
        innerText: innerTextSelector(elementSelector('root.element'), IntegerParser, NumberType),
      },
    });

    const VALUE: number = 123;

    class TestCtrl extends BaseDisposable {
      renderRootInnerText(): number {
        return VALUE;
      }
    }

    beforeAll(() => {
      const templateKey = 'templateKey1';
      Templates.register(templateKey, TEMPLATE_CONTENT);
      Avatar.defineRenderer(TestCtrl, 'renderRootInnerText', $.root.innerText);
      Avatar.define(
          TestCtrl,
          {
            tag: 'gs-test-1',
            templateKey,
          });
      Avatar.registerAll(Injector.newInstance(), Templates.newInstance());
    });

    afterAll(() => {
      Graph.clearNodesForTests([$.root.innerText.getId(), $.root.element.getId()]);
    });

    it(`should render data correctly`, async () => {
      const el = document.createElement('gs-test-1');
      document.body.appendChild(el);

      assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);

      const rootEl = el.shadowRoot!.querySelector('#root') as HTMLElement;

      const promise = new Promise((resolve: any) => {
        window.setInterval(() => {
          if (rootEl.innerText === `${VALUE}`) {
            resolve();
          }
        }, 100);
      });
      await promise;
      el.remove();
    });
  });

  describe('with annotations', () => {
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
