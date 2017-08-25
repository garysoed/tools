import { Selector } from 'src/avatar/selector';
import { ComponentSpec } from '../avatar/component-spec';
import { CustomElement } from '../avatar/custom-element';
import { BaseDisposable } from '../dispose';
import { Graph, GraphEvent } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { NodeId } from '../graph/node-id';
import { ImmutableMap } from '../immutable';
import { Injector } from '../inject';
import { Log } from '../util';
import { Templates } from '../webc';

type Ctrl = typeof BaseDisposable;
type PropertyKey = string | symbol;
type RendererSpec = {parameters: Iterable<NodeId<any>>, selector: Selector<any>};

const LOGGER: Log = Log.of('gs-tools.avatar.Avatar');

export class AvatarImpl {
  private readonly componentSpecs_: Map<typeof BaseDisposable, ComponentSpec<any>> = new Map();
  private readonly rendererSpecs_:
      Map<typeof BaseDisposable, Map<PropertyKey, RendererSpec>> = new Map();

  constructor(private readonly customElements_: CustomElementRegistry) {}

  private createCustomElementClass_(
      parentClass: {prototype: HTMLElement, new (): HTMLElement},
      templateStr: string,
      injector: Injector,
      ctrl: Ctrl,
      rendererSpecs: Map<PropertyKey, RendererSpec>): Function {
    return class extends parentClass implements CustomElement {
      private ctrl_: BaseDisposable | null;

      constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = templateStr || '';
      }

      connectedCallback(): void {
        this.ctrl_ = injector.instantiate(ctrl);

        const entries = ImmutableMap.of(rendererSpecs)
            .values()
            .mapItem((spec: RendererSpec) => {
              return [spec.selector.getId(), spec.selector] as [InstanceId<any>, Selector<any>];
            });
        const idSelectorMap = ImmutableMap.of(entries);

        this.ctrl_.addDisposable(Graph.on(
            'change',
            async (event: GraphEvent<any, any>) => {
              this.onGraphChange_(idSelectorMap, event);
            },
            this));

        for (const [, selector] of idSelectorMap) {
          this.updateElement_(selector);
        }
      }

      disconnectedCallback(): void {
        if (!this.ctrl_) {
          return;
        }

        this.ctrl_.dispose();
      }

      getCtrl(): BaseDisposable | null {
        return this.ctrl_;
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
        selector.setValue(value, this.shadowRoot!);
      }
    };
  }

  define<H extends keyof HTMLElementTagNameMap>(ctrl: Ctrl, spec: ComponentSpec<H>): void {
    if (this.componentSpecs_.has(ctrl)) {
      throw new Error(`${ctrl} is already registered`);
    }
    this.componentSpecs_.set(ctrl, spec);
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

    const parentClass: typeof HTMLElement = spec.parent ? spec.parent.class : HTMLElement;
    const CustomElement = this.createCustomElementClass_(
        parentClass,
        templateStr,
        injector,
        ctrl,
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

export const Avatar = new AvatarImpl(customElements);
