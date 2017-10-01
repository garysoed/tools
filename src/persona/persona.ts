import { BaseDisposable } from '../dispose';
import { AssertionError } from '../error';
import { Graph, GraphEvent, InstanceNodeProvider } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { ImmutableMap, ImmutableSet } from '../immutable';
import { Injector } from '../inject';
import { DispatchFn, Event } from '../interfaces';
import { ComponentSpec } from '../persona/component-spec';
import { CustomElement } from '../persona/custom-element';
import { dispatcherSelector, DispatcherSelector } from '../persona/dispatcher-selector';
import { Listener } from '../persona/listener';
import { Selector } from '../persona/selector';
import { shadowHostSelector } from '../persona/shadow-host-selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';
import { isDescendantOf } from '../typescript';
import { Log } from '../util';
import { Templates } from '../webc';

type Ctrl = typeof BaseDisposable;
type ListenerSpec = {
  handler: (event: Event<any>) => any,
  listener: Listener<any>,
  useCapture: boolean,
};
type PropertyKey = string | symbol;
type RendererSpec = {parameters: Iterable<NodeId<any>>, selector: Selector<any>};

const LOGGER: Log = Log.of('gs-tools.persona.Persona');

export class PersonaImpl {
  private readonly componentSpecs_: Map<typeof BaseDisposable, ComponentSpec<any>> = new Map();
  private readonly inputProviders_: Map<Selector<any>, InstanceNodeProvider<any>> = new Map();
  private readonly listenerSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, ImmutableSet<ListenerSpec>>> = new Map();
  private readonly rendererSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, RendererSpec>> = new Map();

  constructor(private readonly customElements_: CustomElementRegistry) {}

  private createCustomElementClass_(
      parentClass: {prototype: HTMLElement, new (): HTMLElement},
      templateStr: string,
      injector: Injector,
      ctrl: Ctrl,
      tag: string,
      inputs: Iterable<Selector<any>>,
      listenerSpecs: Iterable<[PropertyKey, Iterable<ListenerSpec>]>,
      rendererSpecs: Iterable<[PropertyKey, RendererSpec]>): Function {
    const self = this;
    return class extends parentClass implements CustomElement {
      private ctrl_: BaseDisposable | null;
      private readonly dispatcher_: DispatcherSelector<DispatchFn<{}>> =
          dispatcherSelector<{}>(shadowHostSelector);

      constructor() {
        super();
      }

      connectedCallback(): void {
        Log.onceId(LOGGER, tag);
        Log.groupCollapsed(LOGGER, 'Setting up', tag);
        this.ctrl_ = injector.instantiate(ctrl);
        const shadowRoot = this.getShadowRoot_();
        this.ctrl_[__shadowRoot] = shadowRoot;

        // Install the renderers.
        const renderers = ImmutableMap.of(rendererSpecs)
            .values()
            .mapItem((spec: RendererSpec) => {
              return [spec.selector.getId(), spec.selector] as [InstanceId<any>, Selector<any>];
            });
        const idRendererMap = ImmutableMap.of(renderers);

        this.ctrl_.addDisposable(Graph.on(
            'ready',
            async (event: GraphEvent<any, any>) => {
              this.onGraphReady_(idRendererMap, event);
            },
            this));

        for (const [, selector] of idRendererMap) {
          Log.debug(LOGGER, 'Rendering', selector);
          this.updateElement_(selector);
        }

        // Install the listeners.
        for (const [, specs] of listenerSpecs) {
          for (const {handler, listener, useCapture} of specs) {
            Log.debug(LOGGER, 'Listening to', listener);
            this.ctrl_.addDisposable(
                listener.start(shadowRoot, handler, this.ctrl_, useCapture));
          }
        }

        // Initialize all the inputs
        for (const selector of inputs) {
          self.updateValue(selector, this.ctrl_);
        }

        this.dispatch_('gs-create', shadowRoot);
        Log.groupEnd(LOGGER);
        Log.onceEnd(LOGGER, tag);
      }

      disconnectedCallback(): void {
        if (!this.ctrl_) {
          return;
        }

        this.ctrl_.dispose();
        this.ctrl_ = null;
      }

      private dispatch_(type: string, shadowRoot: ShadowRoot): void {
        const dispatchFn = this.dispatcher_.getValue(shadowRoot);
        if (!dispatchFn) {
          throw new Error(`No dispatchFn found`);
        }
        dispatchFn(type, {});
      }

      getCtrl(): BaseDisposable | null {
        return this.ctrl_;
      }

      private getShadowRoot_(): ShadowRoot {
        const shadowRoot = this.shadowRoot;
        if (shadowRoot) {
          return shadowRoot;
        }
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = templateStr || '';
        return shadow;
      }

      private onGraphReady_(
          idSelectorMap: ImmutableMap<InstanceId<any>, Selector<any>>,
          event: GraphEvent<any, any>): void {
        const id = event.id;
        if (id instanceof InstanceId && event.context === this.ctrl_) {
          const selector = idSelectorMap.get(id);
          if (selector) {
            this.updateElement_(selector);
          }
        }
      }

      private async updateElement_(selector: Selector<any>): Promise<void> {
        const ctrl = this.ctrl_;
        if (!ctrl) {
          throw AssertionError.generic(`Required ctrl cannot be found`);
        }
        const time = Graph.getTimestamp();
        const value = await Graph.get(selector.getId(), time, ctrl);
        selector.setValue(value, this.getShadowRoot_(), time);
      }
    };
  }

  define<H extends keyof HTMLElementTagNameMap>(ctrl: Ctrl, spec: ComponentSpec<H>): void {
    if (this.componentSpecs_.has(ctrl)) {
      throw new Error(`${ctrl} is already registered`);
    }
    this.componentSpecs_.set(ctrl, spec);
  }

  defineListener(
      ctrl: Ctrl,
      propertyKey: PropertyKey,
      listener: Listener<any>,
      useCapture: boolean = false): void {
    const handler = ctrl.prototype[propertyKey];
    if (!(handler instanceof Function)) {
      throw new Error(`${propertyKey} in ${ctrl.constructor} is not a Function. [${handler}]`);
    }

    const propertyMap: Map<PropertyKey, ImmutableSet<ListenerSpec>> =
        this.listenerSpecs_.get(ctrl) || new Map();
    const specs = propertyMap.get(propertyKey) || ImmutableSet.of([]);
    propertyMap.set(propertyKey, specs.add({handler, listener, useCapture}));
    this.listenerSpecs_.set(ctrl, propertyMap);
  }

  defineRenderer(
      ctrl: Ctrl,
      propertyKey: PropertyKey,
      selector: Selector<any>,
      ...parameters: NodeId<any>[]): void {
    const propertyMap: Map<PropertyKey, RendererSpec> = this.rendererSpecs_.get(ctrl) || new Map();
    if (propertyMap.has(propertyKey)) {
      throw new Error(`Renderer ${ctrl}.${propertyKey} is already registered`);
    }

    propertyMap.set(propertyKey, {parameters, selector});
    this.rendererSpecs_.set(ctrl, propertyMap);
  }

  private getAncestorSpecs_<T>(descendantCtor: Function, map: Map<Function, Map<PropertyKey, T>>):
      ImmutableMap<PropertyKey, T> {
    const rv: Map<PropertyKey, {ctor: Function, value: T}> = new Map();
    for (const [ctor, entries] of map) {
      const shouldAdd = ctor === descendantCtor || isDescendantOf(descendantCtor, ctor);
      if (!shouldAdd) {
        continue;
      }

      for (const [key, value] of entries) {
        const existingEntry = rv.get(key);
        if (existingEntry && isDescendantOf(ctor, existingEntry.ctor)) {
          rv.delete(key);
        }

        rv.set(key, {ctor, value});
      }
    }

    return ImmutableMap.of(rv)
        .map(({value}: {ctor: Function, value: T}) => {
          return value;
        });
  }

  getShadowRoot(ctrl: {}): ShadowRoot | null {
    const root = ctrl[__shadowRoot] || null;
    if (!(root instanceof DocumentFragment)) {
      return null;
    }
    return root as ShadowRoot;
  }

  private register_(injector: Injector, templates: Templates, ctrl: Ctrl): void {
    const spec = this.componentSpecs_.get(ctrl);
    if (!spec) {
      return;
    }

    const templateStr = templates.getTemplate(spec.templateKey);
    if (!templateStr) {
      throw new Error(`No templates found for ${spec.templateKey}`);
    }

    if (spec.dependencies) {
      for (const dependency of spec.dependencies) {
        this.register_(injector, templates, dependency as any as Ctrl);
      }
    }

    if (spec.inputs) {
      for (const selector of spec.inputs) {
        if (!Graph.isRegistered(selector.getId())) {
          this.inputProviders_.set(
              selector,
              Graph.createProvider(selector.getId(), selector.getDefaultValue()));
        }
      }
    }

    // Process the renderers.
    const rendererSpecs = this.getAncestorSpecs_(ctrl, this.rendererSpecs_);
    for (const [key, {parameters, selector}] of rendererSpecs) {
      Graph.registerGenericProvider_(
          selector.getId(),
          ctrl.prototype[key],
          ...parameters);
    }

    // Listeners.
    const listenerSpecs = this.getAncestorSpecs_(ctrl, this.listenerSpecs_);

    const parentClass: typeof HTMLElement = spec.parent ? spec.parent.class : HTMLElement;
    const CustomElement = this.createCustomElementClass_(
        parentClass,
        templateStr,
        injector,
        ctrl,
        spec.tag,
        spec.inputs || [],
        listenerSpecs,
        rendererSpecs);

    try {
      if (spec.parent) {
        this.customElements_.define(spec.tag, CustomElement, {extends: spec.parent.tag});
      } else {
        this.customElements_.define(spec.tag, CustomElement);
      }
    } catch (e) {
      Log.error(LOGGER, `Error registering ${spec.tag}`, e);
    }
    Log.info(LOGGER, `Registered: [${spec.tag}]`);
  }

  registerAll(injector: Injector, templates: Templates): void {
    for (const ctrl of this.componentSpecs_.keys()) {
      this.register_(injector, templates, ctrl);
    }
  }

  async updateValue(selector: Selector<any>, ctrl: {}): Promise<void> {
    const shadowRoot = this.getShadowRoot(ctrl);
    if (!shadowRoot) {
      throw AssertionError.condition('object', 'to be a controller', ctrl);
    }

    const provider = this.inputProviders_.get(selector);
    if (!provider) {
      throw AssertionError.condition(`Provider for ${selector}`, 'to exist', provider);
    }

    provider(await selector.getValue(shadowRoot), ctrl);
  }
}

export const Persona = new PersonaImpl(customElements);
