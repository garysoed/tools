import { assert, TestBase } from '../test-base';
TestBase.setup();

import {
  Avatar,
  elementSelector,
  innerTextSelector,
  resolveSelectors } from '../avatar';
import { InstanceofType, NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Graph, NodeProvider, staticId } from '../graph';
import { Injector } from '../inject';
import { IntegerParser } from '../parse';
import { Templates } from '../webc';


describe('avatar functional test without annotations', () => {
  const TEMPLATE_CONTENT = '<div id="root"></div>';
  const $ = resolveSelectors({
    root: {
      element: elementSelector('#root', InstanceofType(HTMLElement)),
      innerText: innerTextSelector(elementSelector('root.element'), IntegerParser, NumberType),
    },
    value: staticId('value', NumberType),
  });

  let valueProvider: NodeProvider<number>;

  class TestCtrl extends BaseDisposable {
    async renderRootInnerText(): Promise<number> {
      return await Graph.get($.value);
    }
  }

  beforeAll(() => {
    const templateKey = 'templateKey1';
    Templates.register(templateKey, TEMPLATE_CONTENT);
    valueProvider = Graph.createProvider($.value, 123);
    Avatar.defineRenderer(TestCtrl, 'renderRootInnerText', $.root.innerText, $.value);
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
    const value = 234;
    await valueProvider(value);

    const promise = new Promise((resolve: any) => {
      window.setInterval(() => {
        if (rootEl.innerText === `${value}`) {
          resolve();
        }
      }, 100);
    });
    await promise;
    await valueProvider(123);
    el.remove();
  });
});
