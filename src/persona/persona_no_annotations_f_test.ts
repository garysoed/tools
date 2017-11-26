import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InstanceofType, NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Flags } from '../dispose/base-disposable';
import { Graph, staticId, StaticNodeProvider, TestGraph } from '../graph';
import { Injector } from '../inject';
import { IntegerParser } from '../parse';
import {
  elementSelector,
  eventListener,
  innerTextSelector,
  Persona,
  resolveSelectors} from '../persona';
import { Templates } from '../webc';


describe('persona functional test without annotations', () => {
  const TEMPLATE_CONTENT = '<div id="root"></div><button id="button">button</button>';
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

  let valueProvider: StaticNodeProvider<number>;
  let mockButtonClickCallback: any;

  class TestCtrl extends BaseDisposable {
    onButtonClick(): void {
      mockButtonClickCallback();
    }

    async renderRootInnerText(): Promise<number> {
      return await Graph.get($.value, Graph.getTimestamp());
    }
  }

  beforeAll(() => {
    const templateKey = 'templateKey1';
    Templates.register(templateKey, TEMPLATE_CONTENT);
    valueProvider = Graph.createProvider($.value, 123);
    Persona.defineListener(TestCtrl, 'onButtonClick', eventListener($.button, 'click'));
    Persona.defineRenderer(TestCtrl, 'renderRootInnerText', $.root.innerText, $.value);
    Persona.define(
        TestCtrl,
        {
          tag: 'gs-test-1',
          templateKey,
        });
    Persona.registerAll(Injector.newInstance(), Templates.newInstance());
  });

  beforeEach(() => {
    Flags.enableTracking = false;
    mockButtonClickCallback = jasmine.createSpy('ButtonClickCallback');
  });

  afterAll(() => {
    TestGraph.clear($.root.innerText.getId(), $.root.element.getId());
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

  it(`should react to event`, async () => {
    const el = document.createElement('gs-test-1');
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
