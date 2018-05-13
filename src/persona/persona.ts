import { BaseDisposable } from '../dispose';
import { Errors } from '../error';
import { Graph, InstanceNodeProvider } from '../graph';
import { NodeId } from '../graph/node-id';
import { ImmutableMap, ImmutableSet } from '../immutable';
import { Injector } from '../inject';
import { ComponentSpec } from '../persona/component-spec';
import { CustomElement, CustomElementInternal } from '../persona/custom-element';
import { Listener } from '../persona/listener';
import { ListenerSpec } from '../persona/listener-spec';
import { Selector } from '../persona/selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';
import { isDescendantOf } from '../typescript';
import { Log } from '../util';
import { Templates } from '../webc';

type Ctrl = typeof BaseDisposable;

type PropertyKey = string | symbol;
type RendererSpec = {parameters: Iterable<NodeId<any>>, selector: Selector<any>};

const LOGGER: Log = Log.of('gs-tools.persona.Persona');

export class PersonaImpl {
  private readonly componentSpecs_: Map<typeof BaseDisposable, ComponentSpec<any>> = new Map();
  private readonly inputProviders_: Map<Selector<any>, InstanceNodeProvider<any>> = new Map();
  private readonly listenerSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, ImmutableSet<ListenerSpec>>> = new Map();
  private readonly registeredSpecs_: Set<typeof BaseDisposable> = new Set();
  private readonly rendererSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, RendererSpec>> = new Map();

  constructor(private readonly customElements_: CustomElementRegistry) {}

  createCustomElementClass_(
      parentClass: {prototype: HTMLElement, new (): HTMLElement},
      templateStr: string,
      injector: Injector,
      ctrl: Ctrl,
      tag: string,
      inputs: Map<Selector<any>, InstanceNodeProvider<any>>,
      listenerSpecs: Iterable<[PropertyKey, Iterable<ListenerSpec>]>,
      rendererSpecs: Iterable<[PropertyKey, RendererSpec]>,
      defaultAttrs: Iterable<[string, string]> = new Map()): Function {

    return class extends parentClass implements CustomElement {
      private readonly customElement_: CustomElement;
      constructor() {
        super();

        this.customElement_ = new CustomElementInternal(
            ctrl,
            defaultAttrs,
            this,
            injector,
            inputs,
            listenerSpecs,
            rendererSpecs,
            tag,
            templateStr);
      }

      connectedCallback(): void {
        return this.customElement_.connectedCallback();
      }

      disconnectedCallback(): void {
        return this.customElement_.disconnectedCallback();
      }

      getCtrl(): BaseDisposable | null {
        return this.customElement_.getCtrl();
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

  getAncestorSpecs_<T>(descendantCtor: Function, map: Map<Function, Map<PropertyKey, T>>):
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

  getValue<T>(selector: Selector<T>, ctrl: {}): T | null {
    const shadowRoot = this.getShadowRoot(ctrl);
    if (!shadowRoot) {
      throw Errors.assert('shadowRoot').shouldExist().butWas(shadowRoot);
    }
    return selector.getValue(shadowRoot);
  }

  register_(injector: Injector, templates: Templates, ctrl: Ctrl): void {
    if (this.registeredSpecs_.has(ctrl)) {
      return;
    }

    const spec = this.componentSpecs_.get(ctrl);
    if (!spec) {
      return;
    }

    const templateStr = templates.getTemplate(spec.templateKey);
    if (!templateStr) {
      throw new Error(`No templates found for ${spec.templateKey}`);
    }

    this.registerDependencies_(spec, injector, templates);
    const inputProviders = this.registerInputs_(spec);
    const rendererSpecs = this.registerRenderers_(ctrl);
    const listenerSpecs = this.registerListeners_(ctrl);

    const parentClass: typeof HTMLElement = spec.parent ? spec.parent.class : HTMLElement;
    const CustomElement = this.createCustomElementClass_(
        parentClass,
        templateStr,
        injector,
        ctrl,
        spec.tag,
        inputProviders,
        listenerSpecs,
        rendererSpecs,
        spec.defaultAttrs);

    this.registerCustomElement_(spec, CustomElement);
    this.registeredSpecs_.add(ctrl);
    Log.info(LOGGER, `Registered: [${spec.tag}]`);
  }

  registerAll(injector: Injector, templates: Templates): void {
    for (const ctrl of this.componentSpecs_.keys()) {
      this.register_(injector, templates, ctrl);
    }
  }

  registerCustomElement_(spec: ComponentSpec<any>, elementCtor: Function): void {
    try {
      if (spec.parent) {
        this.customElements_.define(spec.tag, elementCtor, {extends: spec.parent.tag});
      } else {
        this.customElements_.define(spec.tag, elementCtor);
      }
    } catch (e) {
      Log.error(LOGGER, `Error registering ${spec.tag}`, e);
    }
  }

  registerDependencies_(
      spec: ComponentSpec<any>,
      injector: Injector,
      templates: Templates): void {
    if (spec.dependencies) {
      for (const dependency of spec.dependencies) {
        this.register_(injector, templates, dependency as any as Ctrl);
      }
    }
  }

  registerInputs_(
      spec: ComponentSpec<any>): Map<Selector<any>, InstanceNodeProvider<any>> {
    const inputProviders: Map<Selector<any>, InstanceNodeProvider<any>> = new Map();
    if (spec.inputs) {
      for (const selector of spec.inputs) {
        const provider = this.inputProviders_.get(selector);
        if (!provider) {
          const newProvider = Graph.createProvider(selector.getId(), selector.getDefaultValue());
          inputProviders.set(selector, newProvider);
          this.inputProviders_.set(selector, newProvider);
        } else {
          inputProviders.set(selector, provider);
        }
      }
    }
    return inputProviders;
  }

  registerListeners_(ctrl: Ctrl): ImmutableMap<PropertyKey, any> {
    return this.getAncestorSpecs_(ctrl, this.listenerSpecs_);
  }

  registerRenderers_(ctrl: Ctrl): ImmutableMap<PropertyKey, any> {
    const rendererSpecs = this.getAncestorSpecs_(ctrl, this.rendererSpecs_);
    for (const [key, {parameters, selector}] of rendererSpecs) {
      Graph.registerGenericProvider_(
          selector.getId(),
          ctrl.prototype[key],
          ...parameters);
    }
    return rendererSpecs;
  }
}

export const Persona = new PersonaImpl(customElements);
