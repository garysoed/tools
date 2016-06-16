import BaseDisposable from '../dispose/base-disposable';
import {BaseElement} from './base-element';
import {Checks} from '../checks';
import {ElementConfig} from './element-config';
import Http from '../net/http';
import Log from '../log';
import {Validate} from '../valid/validate';

/**
 * @hidden
 */
const LOG = new Log('pb.component.ComponentConfig');


/**
 * Registers custom elements configured using [ElementConfig]
 */
export class ElementRegistrar extends BaseDisposable {
  private static __instance: symbol = Symbol('instance');

  private registeredConfigs_: Set<ElementConfig>;
  private xtag_: xtag.IInstance;

  /**
   * @hidden
   */
  constructor(xtag: xtag.IInstance) {
    super();
    this.registeredConfigs_ = new Set<ElementConfig>();
    this.xtag_ = xtag;
  }

  private getLifecycleConfig_(config: ElementConfig, content: string): xtag.ILifecycleConfig {
    let addDisposable = this.addDisposable.bind(this);
    return {
      attributeChanged: function(attrName: string, oldValue: string, newValue: string): void {
        ElementRegistrar.runOnInstance_(this, (element: BaseElement) => {
          element.onAttributeChanged(attrName, oldValue, newValue);
        });
      },
      created: function(): void {
        let instance = config.provider();
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
  register(config: ElementConfig): Promise<void> {
    if (this.registeredConfigs_.has(config)) {
      return Promise.resolve();
    }

    return Promise
        .all(config.dependencies.map((dependency: ElementConfig) => {
          return this.register(dependency);
        }))
        .then(() => {
          let promises = [Http.get(config.templateUrl).send()];
          if (config.cssUrl) {
            promises.push(Http.get(config.cssUrl).send());
          }
          return Promise.all(promises);
        })
        .then(
            (results: any[]) => {
              let [content, css] = results;

              if (css !== undefined) {
                content = `<style>${css}</style>\n${content}`;
              }

              this.xtag_.register(
                  config.name,
                  {
                    lifecycle: this.getLifecycleConfig_(config, content),
                  });

              this.registeredConfigs_.add(config);
              Log.info(LOG, `Registered: ${config.name}`);
            },
            (error: string) => {
              Log.error(LOG, `Failed to register ${config.name}. Error: ${error}`);
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
  static newInstance(): ElementRegistrar {
    Validate.any(window['xtag'])
        .to.beDefined()
        .orThrows(`Required x-tag library not found`)
        .assertValid();
    return new ElementRegistrar(window['xtag']);
  }
}
