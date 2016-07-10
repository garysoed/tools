import BaseDisposable from '../dispose/base-disposable';
import {BaseElement} from './base-element';
import {Checks} from '../checks';
import {CustomElement} from './custom-element';
import {Injector} from '../inject/injector';
import {Log} from '../util/log';
import {Validate} from '../valid/validate';
import {Templates} from './templates';

/**
 * @hidden
 */
const LOG = new Log('pb.component.ComponentConfig');


/**
 * Registers custom elements configured using [ElementConfig]
 */
export class ElementRegistrar extends BaseDisposable {
  private static __instance: symbol = Symbol('instance');

  private injector_: Injector;
  private registeredCtors_: Set<gs.ICtor<BaseElement>>;
  private xtag_: xtag.IInstance;

  /**
   * @hidden
   */
  constructor(injector: Injector, xtag: xtag.IInstance) {
    super();
    this.injector_ = injector;
    this.registeredCtors_ = new Set<gs.ICtor<BaseElement>>();
    this.xtag_ = xtag;
  }

  private getLifecycleConfig_(
      elementProvider: () => BaseElement,
      content: string): xtag.ILifecycleConfig {
    let addDisposable = this.addDisposable.bind(this);
    return {
      attributeChanged: function(attrName: string, oldValue: string, newValue: string): void {
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

    let config = CustomElement.getConfig(ctor);
    let dependencies = config.dependencies || [];

    return Promise
        .all(dependencies.map((dependency: gs.ICtor<BaseElement>) => {
          return this.register(dependency);
        }))
        .then(() => {
          let template = Templates.getTemplate(config.templateKey);
          Validate.any(template).toNot.beNull()
              .orThrows(`No templates found for key ${config.templateKey}`)
              .assertValid();

          let provider = () => {
            return this.injector_.instantiate(ctor);
          };
          this.xtag_.register(
              config.tag,
              {lifecycle: this.getLifecycleConfig_(provider, template)});

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
  private static runOnInstance_(el: any, callback: (component: BaseElement) => void): void {
    let instance = el[ElementRegistrar.__instance];
    if (Checks.isInstanceOf(instance, BaseElement)) {
      callback(instance);
    } else {
      throw Error(`Cannot find valid instance on element ${el.nodeName}`);
    }
  }

  /**
   * @return A new instance of the registrar.
   */
  static newInstance(injector: Injector): ElementRegistrar {
    Validate.any(window['xtag'])
        .to.beDefined()
        .orThrows(`Required x-tag library not found`)
        .assertValid();
    return new ElementRegistrar(injector, window['xtag']);
  }
}
