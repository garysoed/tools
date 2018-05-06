import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { StringType } from '../check';
import { BaseDisposable, DisposableFunction } from '../dispose';
import { Graph, InstanceId, instanceId, InstanceNodeProvider } from '../graph';
import { TestDispose } from '../testing';
import { CustomElement, CustomElementInternal } from './custom-element';
import { Selector } from './selector';
import { __shadowRoot } from './shadow-root-symbol';

describe('gs-tools.persona.CustomElementInternal', () => {
  const TEMPLATE_STR = 'templateStr';
  const TAG = 'tag';
  class TestCtrl extends BaseDisposable { }

  let element: HTMLElement;
  let mockInjector: any;
  let listenerSpecMap: Map<any, any>;
  let rendererSpecMap: Map<any, any>;
  let defaultAttrsMap: Map<string, string>;
  let inputMap: Map<Selector<any>, InstanceNodeProvider<any>>;
  let customElement: CustomElement;

  beforeEach(() => {
    mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
    rendererSpecMap = new Map();
    listenerSpecMap = new Map();
    defaultAttrsMap = new Map();
    inputMap = new Map();
    element = document.createElement('div');
    customElement = new CustomElementInternal(
        TestCtrl,
        defaultAttrsMap,
        element,
        mockInjector,
        inputMap,
        listenerSpecMap,
        rendererSpecMap,
        TAG,
        TEMPLATE_STR);
  });

  describe('connectedCallback', () => {
    it(`should instantiate the ctrl correctly`, async () => {
      const mockCtrl = jasmine.createSpyObj('Ctrl', ['addDisposable']);
      mockInjector.instantiate.and.returnValue(mockCtrl);

      const shadowRoot = element.attachShadow({mode: 'open'});
      spyOn(customElement, 'installRenderers_');
      spyOn(customElement, 'installListeners_');
      spyOn(customElement, 'installInputs_').and.returnValue(Promise.resolve());
      spyOn(customElement, 'dispatch_');

      await customElement.connectedCallback();
      assert(customElement['dispatch_']).to.haveBeenCalledWith('gs-connected', shadowRoot);
      assert(customElement['installInputs_']).to.haveBeenCalledWith(mockCtrl, shadowRoot);
      assert(customElement['installListeners_']).to.haveBeenCalledWith(mockCtrl, shadowRoot);
      assert(customElement['installRenderers_']).to.haveBeenCalledWith(mockCtrl);
      assert(mockCtrl[__shadowRoot]).to.equal(shadowRoot);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(TestCtrl);
      assert(customElement.getCtrl()).to.equal(mockCtrl);
    });
  });

  describe('disconnectedCallback', () => {
    it(`should dispose the ctrl`, () => {
      const mockCtrl = jasmine.createSpyObj('Ctrl', ['dispose']);
      customElement['ctrl_'] = mockCtrl;

      customElement.disconnectedCallback();
      assert(mockCtrl.dispose).to.haveBeenCalledWith();
      assert(customElement['ctrl_']).to.beNull();
    });

    it(`should not throw errors if the ctrl does not exist`, () => {
      assert(() => {
        customElement.disconnectedCallback();
      }).toNot.throw();
    });
  });

  describe('installInputs_', () => {
    it(`should initialize all the selectors correctly`, async () => {
      const ctrl = Mocks.object('ctrl');
      const shadowRoot = Mocks.object('shadowRoot');
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['initAsInput']);
      mockSelector1.initAsInput.and.returnValue(Promise.resolve());
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['initAsInput']);
      mockSelector2.initAsInput.and.returnValue(Promise.resolve());
      const provider1 = Mocks.object('provider1');
      const provider2 = Mocks.object('provider2');
      inputMap.set(mockSelector1, provider1);
      inputMap.set(mockSelector2, provider2);

      await customElement['installInputs_'](ctrl, shadowRoot);
      assert(mockSelector1.initAsInput).to.haveBeenCalledWith(shadowRoot, ctrl, provider1);
      assert(mockSelector2.initAsInput).to.haveBeenCalledWith(shadowRoot, ctrl, provider2);
    });
  });

  describe('installListeners_', () => {
    it(`should start the listeners correctly`, () => {
      const mockCtrl = jasmine.createSpyObj('Ctrl', ['addDisposable']);
      const shadowRoot = Mocks.object('shadowRoot');

      const disposable11 = Mocks.object('disposable11');
      const mockListener11 = jasmine.createSpyObj('Listener11', ['start']);
      mockListener11.start.and.returnValue(disposable11);
      const handler11 = Mocks.object('handler11');
      const useCapture11 = true;
      const spec11 = {handler: handler11, listener: mockListener11, useCapture: useCapture11};

      const disposable12 = Mocks.object('disposable12');
      const mockListener12 = jasmine.createSpyObj('Listener12', ['start']);
      mockListener12.start.and.returnValue(disposable12);
      const handler12 = Mocks.object('handler12');
      const useCapture12 = false;
      const spec12 = {handler: handler12, listener: mockListener12, useCapture: useCapture12};

      const disposable21 = Mocks.object('disposable21');
      const mockListener21 = jasmine.createSpyObj('Listener21', ['start']);
      mockListener21.start.and.returnValue(disposable21);
      const handler21 = Mocks.object('handler21');
      const useCapture21 = true;
      const spec21 = {handler: handler21, listener: mockListener21, useCapture: useCapture21};

      const disposable22 = Mocks.object('disposable22');
      const mockListener22 = jasmine.createSpyObj('Listener22', ['start']);
      mockListener22.start.and.returnValue(disposable22);
      const handler22 = Mocks.object('handler22');
      const useCapture22 = false;
      const spec22 = {handler: handler22, listener: mockListener22, useCapture: useCapture22};

      listenerSpecMap.set(Mocks.object('key1'), [spec11, spec12]);
      listenerSpecMap.set(Mocks.object('key2'), [spec21, spec22]);

      customElement['installListeners_'](mockCtrl, shadowRoot);
      assert(mockCtrl.addDisposable).to.haveBeenCalledWith(disposable11);
      assert(mockCtrl.addDisposable).to.haveBeenCalledWith(disposable12);
      assert(mockCtrl.addDisposable).to.haveBeenCalledWith(disposable21);
      assert(mockCtrl.addDisposable).to.haveBeenCalledWith(disposable22);
      assert(mockListener11.start).to
          .haveBeenCalledWith(shadowRoot, handler11, mockCtrl, useCapture11);
      assert(mockListener12.start).to
          .haveBeenCalledWith(shadowRoot, handler12, mockCtrl, useCapture12);
      assert(mockListener21.start).to
          .haveBeenCalledWith(shadowRoot, handler21, mockCtrl, useCapture21);
      assert(mockListener22.start).to
          .haveBeenCalledWith(shadowRoot, handler22, mockCtrl, useCapture22);
    });
  });

  describe('installRenderers_', () => {
    it(`should install the renderers correctly`, () => {
      const mockCtrl = new BaseDisposable();
      TestDispose.add(mockCtrl);
      const id1 = Mocks.object('id1');
      const id2 = Mocks.object('id2');
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['getId']);
      mockSelector1.getId.and.returnValue(id1);
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['getId']);
      mockSelector2.getId.and.returnValue(id2);
      rendererSpecMap.set(Mocks.object('key1'), {selector: mockSelector1});
      rendererSpecMap.set(Mocks.object('key2'), {selector: mockSelector2});

      const graphOnSpy = spyOn(Graph, 'onReady')
          .and.returnValue(DisposableFunction.of(() => undefined));

      spyOn(customElement, 'updateElement_');
      spyOn(customElement, 'onGraphReady_');

      customElement['installRenderers_'](mockCtrl);
      assert(customElement['updateElement_']).to.haveBeenCalledWith(mockCtrl, mockSelector1);
      assert(customElement['updateElement_']).to.haveBeenCalledWith(mockCtrl, mockSelector2);

      assert(Graph.onReady).to.haveBeenCalledWith(mockCtrl, id1, Matchers.anyFunction());
      assert(Graph.onReady).to.haveBeenCalledWith(mockCtrl, id2, Matchers.anyFunction());

      graphOnSpy.calls.argsFor(0)[2]();
      assert(customElement['onGraphReady_']).to.haveBeenCalledWith(mockCtrl, id1, mockSelector1);

      graphOnSpy.calls.argsFor(1)[2]();
      assert(customElement['onGraphReady_']).to.haveBeenCalledWith(mockCtrl, id2, mockSelector2);
    });
  });

  describe('onGraphReady_', () => {
    it(`should update the element correctly`, () => {
      const id = instanceId('id', StringType);
      Object.setPrototypeOf(id, InstanceId.prototype);

      const selector = Mocks.object('selector');
      const context = Mocks.object('context');

      spyOn(customElement, 'updateElement_');

      customElement['onGraphReady_'](context, id, selector);
      assert(customElement['updateElement_']).to.haveBeenCalledWith(context, selector);
    });

    it(`should do nothing if the id isn't InstanceId`, () => {
      const id = Mocks.object('id');

      const selector = Mocks.object('selector');
      const context = Mocks.object('context');

      spyOn(customElement, 'updateElement_');

      customElement['onGraphReady_'](context, id, selector);
      assert(customElement['updateElement_']).toNot.haveBeenCalled();
    });
  });

  describe('setDefaultAttrs_', () => {
    it(`should set the default attributes`, () => {
      defaultAttrsMap.set('a', '1');
      defaultAttrsMap.set('b', '2');

      customElement['setDefaultAttrs_']();
      assert(element.getAttribute('a')).to.be('1');
      assert(element.getAttribute('b')).to.be('2');
    });

    it(`should skip attributes that are already set`, () => {
      defaultAttrsMap.set('a', '1');

      element.setAttribute('a', 'exists');

      customElement['setDefaultAttrs_']();
      assert(element.getAttribute('a')).to.be('exists');
    });
  });

  describe('updateElement_', () => {
    it(`should update the selector correctly`, async () => {
      const id = Mocks.object('id');
      const mockSelector = jasmine.createSpyObj('Selector', ['getId', 'setValue']);
      mockSelector.getId.and.returnValue(id);

      const value = Mocks.object('value');
      spyOn(Graph, 'get').and.returnValue(Promise.resolve(value));

      const shadowRoot = element.attachShadow({mode: 'open'});

      const ctrl = Mocks.object('ctrl');
      const timestamp = Mocks.object('timestamp');
      spyOn(Graph, 'getTimestamp').and.returnValue(timestamp);

      await customElement['updateElement_'](ctrl, mockSelector);
      assert(mockSelector.setValue).to.haveBeenCalledWith(value, shadowRoot, timestamp);
      assert(Graph.get).to.haveBeenCalledWith(id, timestamp, ctrl);
    });
  });
});
