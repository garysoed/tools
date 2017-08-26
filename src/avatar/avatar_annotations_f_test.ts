import { assert, TestBase } from '../test-base';
TestBase.setup();

import {
  Avatar,
  component,
  elementSelector,
  innerTextSelector,
  render,
  resolveSelectors } from '../avatar';
import { InstanceofType, NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Graph, nodeIn, NodeProvider, staticId } from '../graph';
import { Injector } from '../inject';
import { IntegerParser } from '../parse';
import { Templates } from '../webc';


describe('avatar functional test with annotations', () => {
  const TEMPLATE_CONTENT = '<div id="root"></div>';
  const TEMPLATE_KEY = 'templateKey';
  Templates.register(TEMPLATE_KEY, TEMPLATE_CONTENT);

  let valueProvider: NodeProvider<number>;
  const $ = resolveSelectors({
    root: {
      element: elementSelector('#root', InstanceofType(HTMLElement)),
      innerText: innerTextSelector(elementSelector('root.element'), IntegerParser, NumberType),
    },
    value: staticId('value', NumberType),
  });

  @component({
    tag: 'gs-test',
    templateKey: TEMPLATE_KEY,
  })
  class TestCtrl extends BaseDisposable {
    @render.innerText($.root.innerText)
    async renderRootInnerText(@nodeIn($.value) value: number): Promise<number> {
      return Promise.resolve(value);
    }
  }

  beforeAll(() => {
    valueProvider = Graph.createProvider($.value, 123);
    Avatar.registerAll(Injector.newInstance(), Templates.newInstance());
  });

  it(`should create the element correctly`, async () => {
    const el = document.createElement('gs-test');
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
