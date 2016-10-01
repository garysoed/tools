import {InjectUtil} from './inject-util';
import Reflect from '../util/reflect';
import {Validate} from '../valid/validate';


/**
 * Key for binding a value.
 *
 * You should be using `string`. This is done only for compatibility with the class decorator.
 */
type BindKey = string | symbol;

/**
 * Function that accepts an Injector as an argument and returns a value to be bound.
 */
type Provider<T> = (injector: Injector) => T;

/**
 * @hidden
 */
const INJECTOR_BIND_KEY_ = '$gsInjector';


/**
 * Light dependency injection library.
 *
 * Using this consists of 3 parts:
 *
 * 1.  First, you will need to bind the class that can be injected. Apply the `@Bind` annotation on
 *     the class.
 * 1.  Next, on constructor parameters you want to do injection on, apply the `@Inject` annotation
 *     on the parameter.
 * 1.  To instantiate a class, use the [[instantiate]] method. This will inject any parameters
 *     marked by the `@Inject` annotation with the bound value. Note that any classes injected this
 *     way must have all of its constructor parameters be `@Inject`d.
 *
 * For example:
 *
 * ```typescript
 * import Bind from './inject/a-bind';
 * import Inject from './inject/a-inject';
 * import Injector from './inject/injector';
 *
 * // Ignore the \. This is a bug with the typedoc parser.
 * \@Bind()
 * class Service {
 *   constructor() {}
 * }
 *
 * class App {
 *   private service_: Service;
 *
 *   constructor(@Inject() Service) {
 *     this.service_ = Service;
 *   }
 * }
 *
 * let injector = new Injector();
 * let app = injector.instantiate(App);
 * ```
 *
 * By default, both `@Bind` and `@Inject` uses the class name and parameter name to determine the
 * binding key. However, you can override this behavior by specifying the names.
 *
 * You can always inject the injector by using the `$gsInjector` binding key. This means either
 * using `@Inject()` on a parameter called `$gsInjector` or by using `@Inject('$gsInjector')`.
 *
 * Any classes with `@Bind` are treated as singleton per instance of [[Injector]].
 */
export class Injector {
  private static BINDINGS_: Map<BindKey, Provider<any>> = new Map<BindKey, Provider<any>>();

  private instances_: Map<BindKey, any>;

  /**
   * @hidden
   */
  constructor() {
    this.instances_ = new Map<BindKey, any>();
    this.instances_.set(INJECTOR_BIND_KEY_, this);
  }

  /**
   * Instantiates and returns the value bound to the given binding key.
   *
   * This is different from [[instantiate]] in that this only handles bound values and the instance
   * created will be cached.
   *
   * For example:
   *
   * ```typescript
   * \@Bind('example-class')
   * class ExampleClass {}
   *
   * let injector = new Injector();
   * injector.getBoundValue('example-class');  // This will be cached.
   * injector.instantiate(ExampleClass); // This is a different instance from the previous one.
   * ```
   *
   * @param bindKey The key whose value should be returned.
   * @return The instance bound to the given key.
   */
  getBoundValue(bindKey: BindKey, isOptional: boolean = false): any {
    if (this.instances_.has(bindKey)) {
      return this.instances_.get(bindKey);
    }

    if (!isOptional) {
      Validate.map(Injector.BINDINGS_)
          .to.containKey(bindKey)
          .orThrows(`No value bound to key ${bindKey}`)
          .assertValid();
    }
    let provider = Injector.BINDINGS_.has(bindKey)
        ? Injector.BINDINGS_.get(bindKey) : () => undefined;
    let instance = provider!(this);
    this.instances_.set(bindKey, instance);

    return instance;
  }

  /**
   * Gets the resolved parameters of the given constructor.
   *
   * @param ctor The constructor whose parameters should be resolved.
   * @param extraArguments Arguments to apply to the constructor parameter. The key should be the
   *    parameter index, and the value is the value to assign to that index.
   * @return Array of resolved parameters of the given constructor.
   */
  getParameters(ctor: gs.ICtor<any>, extraArguments: {[index: number]: any} = {}): any[] {
    let metadataMap = InjectUtil.getMetadataMap(ctor);

    // Collects the arguments.
    let args: any[] = [];
    for (let i = 0; i < ctor.length; i++) {
      if (extraArguments[i] !== undefined) {
        args.push(extraArguments[i]);
      } else {
        Validate.map(metadataMap)
            .to.containKey(i)
            .orThrows(
                `Cannot find injection candidate for index ${i} for ${ctor} when instantiating`)
            .assertValid();
        let metadata = metadataMap.get(i);
        args.push(this.getBoundValue(metadata!.getKeyName(), metadata!.isOptional()));
      }
    }
    return args;
  }


  /**
   * Instantiates the given constructor.
   *
   * This will check for any `@Inject` annotations on the parameter and use the `@Bind` values. If
   * there are any parameters without `@Inject`, you have to specify the values in the
   * extraArguments object.
   *
   * The extraArguments object can also be used to override parameters that are `@Inject` annotated.
   *
   * @param ctor The constructor to use to instantiates the object.
   * @param extraArguments An object used to set the value of the constructor parameters. The index
   *     is the parameter index and the value is the value to set for the corresponding parameter.
   * @return The newly instantiated object.
   */
  instantiate<T>(ctor: gs.ICtor<T>, extraArguments: {[index: number]: any} = {}): T {
    return Reflect.construct(ctor, this.getParameters(ctor, extraArguments));
  }

  /**
   * Binds the given constructor to the given bind key.
   *
   * @param ctor The constructor to bind.
   * @param bindKey The key to bind the constructor to.
   */
  static bind(ctor: gs.ICtor<any>, bindKey: BindKey): void {
    Injector.bindProvider(
        function(injector: Injector): any {
          return injector.instantiate(ctor);
        },
        bindKey);
  }

  /**
   * Binds the given provider to the given binding key.
   *
   * @param provider The provider to bind.
   * @param bindKey The key to bind the provider to.
   */
  static bindProvider(
      provider: Provider<any>,
      bindKey: BindKey): void {
    Validate
        .batch({
          'boundKey': Validate.map(Injector.BINDINGS_)
              .toNot.containKey(bindKey)
              .orThrows(`Binding ${bindKey} is already bound`),
          'reservedKey': Validate.any(bindKey)
              .toNot.beEqualTo(INJECTOR_BIND_KEY_)
              .orThrows(`${INJECTOR_BIND_KEY_} is a reserved key`),
        })
        .to.allBeValid()
        .assertValid();
    Injector.BINDINGS_.set(bindKey, provider);
  }

  /**
   * @return A new Injector instane.
   */
  static newInstance(): Injector {
    return new Injector();
  }
}
