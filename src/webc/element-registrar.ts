import { InstanceofType } from '../check/instanceof-type';
import { Maps } from '../collection/maps';
import { Sets } from '../collection/sets';
import { BaseDisposable } from '../dispose/base-disposable';
import { Iterables } from '../immutable/iterables';
import { Injector } from '../inject/injector';
import { Parser } from '../interfaces/parser';
import { Cases } from '../string/cases';
import { Log } from '../util/log';
import { BaseElement } from '../webc/base-element';
import { CustomElementUtil } from '../webc/custom-element-util';
import { DomHook } from '../webc/dom-hook';
import { Handler } from '../webc/handle';
import { ANNOTATIONS as HookAnnotations, BinderFactory as HookBinderFactory } from '../webc/hook';
import { DomBinder } from '../webc/interfaces';
import { Templates } from '../webc/templates';


/**
 * @hidden
 */
const LOG = new Log('gs.webc.ElementRegistrar');


/**
 * Registers custom elements configured using [ElementConfig]
 */
export class ElementRegistrar extends BaseDisposable {
  private static __instance: symbol = Symbol('instance');

  private registeredCtors_: Set<gs.ICtor<BaseElement>> = new Set();

  /**
   * @hidden
   */
  constructor(
      private injector_: Injector,
      private templates_: Templates,
      private xtag_: xtag.IInstance) {
    super();
  }

  private getLifecycleConfig_(
      attributes: {[name: string]: Parser<any>},
      elementProvider: () => BaseElement,
      content: string): xtag.ILifecycleConfig {
    const addDisposable = this.addDisposable.bind(this);
    // TODO: Log error for every one of these methods.
    return {
      attributeChanged: function(attrName: string, oldValue: string, newValue: string): void {
        const propertyName = Cases.of(attrName).toCamelCase();
        if (attributes[propertyName]) {
          this[propertyName] = attributes[propertyName].parse(newValue);
        }
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onAttributeChanged(attrName, oldValue, newValue);
        });
      },
      created: function(): void {
        const instance = elementProvider();
        addDisposable(instance);

        this[ElementRegistrar.__instance] = instance;
        const shadow = this.createShadowRoot();
        shadow.innerHTML = content;

        CustomElementUtil.addAttributes(this, attributes);
        CustomElementUtil.setElement(instance, this);

        const instancePrototype = instance.constructor;
        for (const [key, factories] of
            HookAnnotations.forCtor(instancePrototype).getAttachedValues()) {
          if (factories.size() > 1) {
            throw new Error(`Key ${key} can only have 1 Bind annotation`);
          }
          const factory = Sets
              .of<HookBinderFactory>(new Set(Iterables.toArray(factories)))
              .anyValue();
          if (factory === null) {
            return;
          }

          const hook = instance[key];
          if (!(hook instanceof DomHook)) {
            throw new Error(`Key ${key} should be an instance of DomHook`);
          }
          hook.open(factory(this, instance));
        }

        instance.onCreated(this);
        Handler.configure(this, instance);
      },
      inserted: function(): void {
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onInserted(this);
        });
      },
      removed: function(): void {
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onRemoved(this);
        });
      },
    };
  }

  /**
   * Registers the given configuration.
   * @param config The configuration object to register.
   * @return Promise that will be resolved when the registration process is done.
   */
  async register(ctor: gs.ICtor<BaseElement>): Promise<void> {
    const config = CustomElementUtil.getConfig(ctor);
    if (!config) {
      return Promise.resolve();
    }

    const dependencies = config.dependencies || [];
    const promises = dependencies.map((dependency: gs.ICtor<BaseElement>) => {
      return this.register(dependency);
    });

    try {
      await Promise.all(promises);
      if (!this.registeredCtors_.has(ctor)) {
        const template = this.templates_.getTemplate(config.templateKey);
        if (template === null) {
          throw new Error(`No templates found for key ${config.templateKey}`);
        }

        this.xtag_.register(
            config.tag,
            {
              lifecycle: this.getLifecycleConfig_(
                  config.attributes || {},
                  () => {
                    return this.injector_.instantiate(ctor);
                  },
                  template!),
            });

        this.registeredCtors_.add(ctor);
        Log.info(LOG, `Registered: ${config.tag}`);
      }
    } catch (error) {
      Log.error(LOG, `Failed to register ${config.tag}. Error: ${error}`);
      throw error;
    }
  }

  /**
   * @return A new instance of the registrar.
   */
  static newInstance(injector: Injector, templates: Templates): ElementRegistrar {
    const xtag = window['xtag'];
    if (xtag === undefined) {
      throw new Error(`Required x-tag library not found`);
    }
    return new ElementRegistrar(injector, templates, xtag);
  }

  /**
   * Runs the given function on an instance stored in the given element.
   *
   * @param el The element containing the instance to run the function on.
   * @param callback The function to run on the instance.
   */
  private static runOnInstance_(el: any, callback: (component: BaseElement) => void): any {
    const instance = el[ElementRegistrar.__instance];
    if (InstanceofType(BaseElement).check(instance)) {
      return callback(instance);
    } else {
      throw Error(`Cannot find valid instance on element ${el.nodeName}`);
    }
  }
}
// TODO: Mutable
