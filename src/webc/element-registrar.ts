import {Maps} from '../collection/maps';
import {Sets} from '../collection/sets';
import {BaseDisposable} from '../dispose/base-disposable';
import {Injector} from '../inject/injector';
import {Cases} from '../string/cases';
import {Checks} from '../util/checks';
import {Log} from '../util/log';
import {Validate} from '../valid/validate';

import {BaseElement} from './base-element';
import {ANNOTATIONS as BindAnnotations} from './bind';
import {CustomElementUtil} from './custom-element-util';
import {DomHook} from './dom-hook';
import {Handler} from './handle';
import {IAttributeParser, IDomBinder} from './interfaces';
import {Templates} from './templates';

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
      attributes: {[name: string]: IAttributeParser<any>},
      elementProvider: () => BaseElement,
      content: string): xtag.ILifecycleConfig {
    let addDisposable = this.addDisposable.bind(this);
    // TODO: Log error for every one of these methods.
    return {
      attributeChanged: function(attrName: string, oldValue: string, newValue: string): void {
        let propertyName = Cases.of(attrName).toCamelCase();
        if (attributes[propertyName]) {
          this[propertyName] = attributes[propertyName].parse(newValue);
        }
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onAttributeChanged(attrName, oldValue, newValue);
        });
      },
      created: function(): void {
        let instance = elementProvider();
        addDisposable(instance);

        this[ElementRegistrar.__instance] = instance;
        let shadow = this.createShadowRoot();
        shadow.innerHTML = content;

        CustomElementUtil.addAttributes(this, attributes);
        CustomElementUtil.setElement(instance, this);

        let instancePrototype = instance.constructor;
        Maps.of(BindAnnotations.forCtor(instancePrototype).getAttachedValues())
            .forEach((
                factories: Set<(element: HTMLElement, instance: any) => IDomBinder<any>>,
                key: string | symbol) => {
              if (factories.size > 1) {
                throw Validate.fail(`Key ${key} can only have 1 Bind annotation`);
              }
              let factory = Sets.of(factories).anyValue();
              if (factory === null) {
                return;
              }

              let hook = instance[key];
              Validate.any(hook).to.beAnInstanceOf(DomHook).assertValid();
              (<DomHook<any>> hook).open(factory(this, instance));
            });

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
    let config = CustomElementUtil.getConfig(ctor);
    if (!config) {
      return Promise.resolve();
    }

    let dependencies = config.dependencies || [];
    let promises = dependencies.map((dependency: gs.ICtor<BaseElement>) => {
      return this.register(dependency);
    });

    try {
      await Promise.all(promises);
      if (!this.registeredCtors_.has(ctor)) {
        let template = this.templates_.getTemplate(config.templateKey);
        Validate.any(template).toNot.beNull()
            .orThrows(`No templates found for key ${config.templateKey}`)
            .assertValid();

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
   * Runs the given function on an instance stored in the given element.
   *
   * @param el The element containing the instance to run the function on.
   * @param callback The function to run on the instance.
   */
  private static runOnInstance_(el: any, callback: (component: BaseElement) => void): any {
    let instance = el[ElementRegistrar.__instance];
    if (Checks.isInstanceOf(instance, BaseElement)) {
      return callback(instance);
    } else {
      throw Error(`Cannot find valid instance on element ${el.nodeName}`);
    }
  }

  /**
   * @return A new instance of the registrar.
   */
  static newInstance(injector: Injector, templates: Templates): ElementRegistrar {
    Validate.any(window['xtag'])
        .to.beDefined()
        .orThrows(`Required x-tag library not found`)
        .assertValid();
    return new ElementRegistrar(injector, templates, window['xtag']);
  }
}
