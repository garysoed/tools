import { CustomElement } from '../avatar/custom-element';
import { BaseDisposable } from '../dispose';
import { Injector } from '../inject';
import { Log } from '../util';
import { Templates } from '../webc';

type D<T> = {
  prototype: T,
  new (): T,
};
type Ctor<M> = {[C in keyof M]: D<M[C]>};

type ComponentSpec<H extends keyof HTMLElementTagNameMap> = {
  ctrl: typeof BaseDisposable,
  dependencies?: Iterable<typeof Object>,
  parent?: {
    class: Ctor<HTMLElementTagNameMap>[H],
    tag: H,
  },
  tag: string,
  templateKey: string,
};

const LOGGER: Log = Log.of('gs-tools.avatar.Avatar');

export class AvatarImpl {
  private readonly componentSpecs_: Map<typeof BaseDisposable, ComponentSpec<any>> = new Map();

  constructor(private readonly customElements_: CustomElementRegistry) {}

  define<H extends keyof HTMLElementTagNameMap>(spec: ComponentSpec<H>): void {
    if (this.componentSpecs_.has(spec.ctrl)) {
      throw new Error(`${spec.ctrl} is already registered`);
    }
    this.componentSpecs_.set(spec.ctrl, spec);
  }

  private register_<H extends keyof HTMLElementTagNameMap>(
      injector: Injector, templates: Templates, spec: ComponentSpec<H>): void {
    const templateStr = templates.getTemplate(spec.templateKey);
    if (!templateStr) {
      throw new Error(`No templates found for ${spec.templateKey}`);
    }

    if (spec.dependencies) {
      for (const dependency of spec.dependencies) {
        const dependencySpec = this.componentSpecs_.get(dependency as any);
        if (dependencySpec) {
          this.register_(injector, templates, dependencySpec);
        }
      }
    }

    const parentClass: typeof HTMLElement = spec.parent ? spec.parent.class : HTMLElement;

    const CustomElement = class extends parentClass implements CustomElement {
      private ctrl_: BaseDisposable | null;

      constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = templateStr || '';
      }

      connectedCallback(): void {
        this.ctrl_ = injector.instantiate(spec.ctrl);
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
    };

    if (spec.parent) {
      this.customElements_.define(spec.tag, CustomElement, {extends: spec.parent.tag});
    } else {
      this.customElements_.define(spec.tag, CustomElement);
    }
    Log.info(LOGGER, `Registered: [${spec.tag}]`);
  }

  registerAll(injector: Injector, templates: Templates): void {
    for (const [, spec] of this.componentSpecs_) {
      this.register_(injector, templates, spec);
    }
  }
}

export const Avatar = new AvatarImpl(customElements);
