import {BaseDisposable} from '../dispose/base-disposable';
import {BaseElement} from './base-element';
import {Cases} from '../string/cases';
import {Checks} from '../util/checks';
import {CustomElementUtil} from './custom-element-util';
import {IAttributeParser} from './interfaces';
import {Injector} from '../inject/injector';
import {Log} from '../util/log';
import {Validate} from '../valid/validate';
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

        instance.onCreated(this);
      },
      inserted: function(): void {
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onInserted();
        });
      },
      removed: function(): void {
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onRemoved();
        });
      },
    };
  }

  /**
   * Registers the given configuration.
   * @param config The configuration object to register.
   * @return Promise that will be resolved when the registration process is done.
   */
  register(ctor: gs.ICtor<BaseElement>): Promise<void> {
    if (this.registeredCtors_.has(ctor)) {
      return Promise.resolve();
    }

    let config = CustomElementUtil.getConfig(ctor);
    if (!config) {
      return Promise.resolve();
    }

    let dependencies = config.dependencies || [];

    return Promise
        .all(dependencies.map((dependency: gs.ICtor<BaseElement>) => {
          return this.register(dependency);
        }))
        .then(() => {
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
        },
        (error: string) => {
          Log.error(LOG, `Failed to register ${config.tag}. Error: ${error}`);
        });
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
