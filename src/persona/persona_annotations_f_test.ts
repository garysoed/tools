import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InstanceofType, NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Flags } from '../dispose/base-disposable';
import { Graph, nodeIn, staticId, StaticNodeProvider } from '../graph';
import { Injector } from '../inject';
import { IntegerParser } from '../parse';
import {
  component,
  elementSelector,
  innerTextSelector,
  onDom,
  Persona,
  render,
  resolveSelectors} from '../persona';
import { Templates } from '../webc';


describe('persona functional test with annotations', () => {
  const TEMPLATE_CONTENT = '<div id="root"></div><button id="button">button</button>';
  const TEMPLATE_KEY = 'templateKey';
  Templates.register(TEMPLATE_KEY, TEMPLATE_CONTENT);

  let valueProvider: StaticNodeProvider<number>;
  let mockButtonClickCallback: any;

  const $ = resolveSelectors({
    button: elementSelector('#button', InstanceofType(HTMLButtonElement)),
    root: {
      element: elementSelector('#root', InstanceofType(HTMLElement)),
      innerText: innerTextSelector(
          elementSelector('root.element'),
          IntegerParser,
          NumberType,
          123),
    },
    value: staticId('value', NumberType),
  });

  @component({
    tag: 'gs-test',
    templateKey: TEMPLATE_KEY,
  })
  class TestCtrl extends BaseDisposable {
    @onDom.event($.button, 'click')
    onButtonClick(): void {
      mockButtonClickCallback();
    }

    @render.innerText($.root.innerText)
    async renderRootInnerText(@nodeIn($.value) value: number): Promise<number> {
      return Promise.resolve(value);
    }
  }

  beforeAll(() => {
    valueProvider = Graph.createProvider($.value, 123);
    Persona.registerAll(Injector.newInstance(), Templates.newInstance());
  });

  beforeEach(() => {
    Flags.enableTracking = false;
    mockButtonClickCallback = jasmine.createSpy('ButtonClickCallback');
  });

  it(`should create the element correctly`, async () => {
    const el = document.createElement('gs-test');
    document.body.appendChild(el);

    assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);
    const value = 234;
    await valueProvider(value);

    const rootEl = el.shadowRoot!.querySelector('#root') as HTMLElement;
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

  it(`should react to event`, async () => {
    const el = document.createElement('gs-test');
    const promise = new Promise((resolve: any) => {
      el.addEventListener('gs-connected', resolve);
    });
    document.body.appendChild(el);
    await promise;

    assert(el['getCtrl']()).to.beAnInstanceOf(TestCtrl);

    const buttonEl = el.shadowRoot!.querySelector('#button') as HTMLButtonElement;
    buttonEl.click();

    assert(mockButtonClickCallback).to.haveBeenCalledWith();
    el.remove();
  });
});
