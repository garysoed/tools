import { BaseDisposable } from '../dispose';
import { Graph, GraphEvent } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { ImmutableMap } from '../immutable';
import { Injector } from '../inject';
import { Event } from '../interfaces';
import { ComponentSpec } from '../persona/component-spec';
import { CustomElement } from '../persona/custom-element';
import { Listener } from '../persona/listener';
import { __onCreated } from '../persona/on-created-symbol';
import { Selector } from '../persona/selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';
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
  private readonly listenerSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, ListenerSpec>> = new Map();
  private readonly rendererSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, RendererSpec>> = new Map();

  constructor(private readonly customElements_: CustomElementRegistry) {}

  private createCustomElementClass_(
      parentClass: {prototype: HTMLElement, new (): HTMLElement},
      templateStr: string,
      injector: Injector,
      ctrl: Ctrl,
      listenerSpecs: Map<PropertyKey, ListenerSpec>,
      rendererSpecs: Map<PropertyKey, RendererSpec>): Function {
    return class extends parentClass implements CustomElement {
      private ctrl_: BaseDisposable | null;

      constructor() {
        super();
      }

      connectedCallback(): void {
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
            'change',
            async (event: GraphEvent<any, any>) => {
              this.onGraphChange_(idRendererMap, event);
            },
            this));

        for (const [, selector] of idRendererMap) {
          this.updateElement_(selector);
        }

        // Install the listeners.
        for (const [, {handler, listener, useCapture}] of listenerSpecs) {
          this.ctrl_.addDisposable(
              listener.start(shadowRoot, handler, this.ctrl_, useCapture));
        }

        const onCreatedHandler = this.ctrl_[__onCreated];
        if (onCreatedHandler instanceof Function) {
          onCreatedHandler.call(this.ctrl_, shadowRoot);
        }
      }

      disconnectedCallback(): void {
        if (!this.ctrl_) {
          return;
        }

        this.ctrl_.dispose();
        this.ctrl_ = null;
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

      private onGraphChange_(
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
        const value = await Graph.get(selector.getId(), this.ctrl_);
        selector.setValue(value, this.getShadowRoot_());
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

    const propertyMap: Map<PropertyKey, ListenerSpec> = this.listenerSpecs_.get(ctrl) || new Map();
    if (propertyMap.has(propertyKey)) {
      throw new Error(`Listener ${ctrl}.${propertyKey} is already registered`);
    }

    propertyMap.set(propertyKey, {handler, listener, useCapture});
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

    // Process the inputs.
    if (spec.inputs) {
      for (const selector of spec.inputs) {
        Graph.registerGenericProvider_(
            selector.getId(),
            false,
            selector.getProvider());
      }
    }

    // Process the renderers.
    const rendererSpecs = this.rendererSpecs_.get(ctrl);
    if (rendererSpecs) {
      for (const [key, {parameters, selector}] of rendererSpecs) {
        Graph.registerGenericProvider_(
            selector.getId(),
            true,
            ctrl.prototype[key],
            ...parameters);
      }
    }

    // Listeners.
    const listenerSpecs = this.listenerSpecs_.get(ctrl);

    const parentClass: typeof HTMLElement = spec.parent ? spec.parent.class : HTMLElement;
    const CustomElement = this.createCustomElementClass_(
        parentClass,
        templateStr,
        injector,
        ctrl,
        listenerSpecs || new Map(),
        rendererSpecs || new Map());

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
}

export const Persona = new PersonaImpl(customElements);
