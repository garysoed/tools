import { BaseDisposable } from '../dispose';
import { Graph, InstanceId, InstanceNodeProvider, NodeId } from '../graph';
import { ImmutableMap } from '../immutable';
import { Injector } from '../inject';
import { DispatchFn } from '../interfaces';
import { Log } from '../util';
import { dispatcherSelector } from './dispatcher-selector';
import { ListenerSpec } from './listener-spec';
import { RendererSpec } from './renderer-spec';
import { Selector } from './selector';
import { DispatcherSelector } from './selectors';
import { shadowHostSelector } from './shadow-host-selector';
import { __shadowRoot } from './shadow-root-symbol';

const LOGGER: Log = Log.of('gs-tools.persona.CustomElement');

export interface CustomElement {
  connectedCallback(): void;

  disconnectedCallback(): void;

  getCtrl(): BaseDisposable | null;
}

export class CustomElementInternal implements CustomElement {
  private ctrl_: BaseDisposable | null = null;
  private readonly dispatcher_: DispatcherSelector<DispatchFn<{}>> =
      dispatcherSelector<{}>(shadowHostSelector);

  constructor(
      private readonly ctrlClass_: typeof BaseDisposable,
      private readonly defaultAttrs_: Iterable<[string, string]>,
      private readonly element_: HTMLElement,
      private readonly injector_: Injector,
      private readonly inputs_: Map<Selector<any>, InstanceNodeProvider<any>>,
      private readonly listenerSpecs_: Iterable<[PropertyKey, Iterable<ListenerSpec>]>,
      private readonly rendererSpecs_: Iterable<[PropertyKey, RendererSpec]>,
      private readonly tag_: string,
      private readonly templateStr_: string) {
    this.setDefaultAttrs_();
  }

  async connectedCallback(): Promise<void> {
    Log.onceId(LOGGER, this.tag_);
    Log.debug(LOGGER, 'Setting up', this.tag_);
    const ctrlInstance = this.injector_.instantiate(this.ctrlClass_);
    this.ctrl_ = ctrlInstance;
    const shadowRoot = this.getShadowRoot_();
    this.ctrl_[__shadowRoot] = shadowRoot;

    await this.installInputs_(ctrlInstance, shadowRoot);
    this.installListeners_(ctrlInstance, shadowRoot);
    this.installRenderers_(ctrlInstance);

    this.dispatch_('gs-connected', shadowRoot);
    Log.onceEnd(LOGGER, this.tag_);
  }

  disconnectedCallback(): void {
    if (!this.ctrl_) {
      return;
    }

    this.ctrl_.dispose();
    this.ctrl_ = null;
  }

  dispatch_(type: string, shadowRoot: ShadowRoot): void {
    const dispatchFn = this.dispatcher_.getValue(shadowRoot);
    if (!dispatchFn) {
      throw new Error(`No dispatchFn found`);
    }
    dispatchFn(type, {});
  }

  getCtrl(): BaseDisposable | null {
    return this.ctrl_;
  }

  getShadowRoot_(): ShadowRoot {
    const shadowRoot = this.element_.shadowRoot;
    if (shadowRoot) {
      return shadowRoot;
    }
    const shadow = this.element_.attachShadow({mode: 'open'});
    shadow.innerHTML = this.templateStr_ || '';
    return shadow;
  }

  installInputs_(ctrl: BaseDisposable, shadowRoot: ShadowRoot): Promise<void[]> {
    const promises: Promise<void>[] = [];
    for (const [selector, provider] of this.inputs_) {
      promises.push(selector.initAsInput(shadowRoot, ctrl, provider));
    }
    return Promise.all(promises);
  }

  installListeners_(ctrl: BaseDisposable, shadowRoot: ShadowRoot): void {
    for (const [, specs] of this.listenerSpecs_) {
      for (const {handler, listener, useCapture} of specs) {
        Log.debug(LOGGER, 'Listening to', listener);
        ctrl.addDisposable(
            listener.start(shadowRoot, handler, ctrl, useCapture));
      }
    }
  }

  installRenderers_(ctrl: BaseDisposable): void {
    const renderers = ImmutableMap.of(this.rendererSpecs_)
        .values()
        .mapItem((spec: RendererSpec) => {
          return [spec.selector.getId(), spec.selector] as [InstanceId<any>, Selector<any>];
        });
    const idRendererMap = ImmutableMap.of(renderers);

    for (const [id, selector] of idRendererMap) {
      ctrl.addDisposable(Graph.onReady(
          ctrl,
          id,
          () => this.onGraphReady_(ctrl, id, selector)));

      Log.debug(LOGGER, 'Rendering', selector);
      this.updateElement_(ctrl, selector);
    }
  }

  onGraphReady_(
      ctrlInstance: BaseDisposable, id: NodeId<any>, selector: Selector<any>): void {
    if (!(id instanceof InstanceId)) {
      return;
    }
    this.updateElement_(ctrlInstance, selector);
  }

  setDefaultAttrs_(): void {
    for (const [key, value] of this.defaultAttrs_) {
      if (!this.element_.hasAttribute(key)) {
        this.element_.setAttribute(key, value);
      }
    }
  }

  async updateElement_(
      ctrlInstance: BaseDisposable, selector: Selector<any>): Promise<void> {
    const time = Graph.getTimestamp();
    const value = await Graph.get(selector.getId(), time, ctrlInstance);
    selector.setValue(value, this.getShadowRoot_(), time);
  }
}
