import Asserts from '../assert/asserts';
import Maps from '../collection/maps';
import Reflect from '../reflect';


/**
 * Key for binding a value.
 *
 * You should be using `string`. This is done only for compatibility with the class decorator.
 */
type BindKey = string | symbol;

const INJECTOR_BIND_KEY_ = '$gsInjector';

class BindInfo_ {
  private boundArgs_: Map<number, any>;
  private ctor_: gs.ICtor<any>;

  constructor(ctor: gs.ICtor<any>, boundArgs: Map<number, any>) {
    this.ctor_ = ctor;
    this.boundArgs_ = boundArgs;
  }

  get boundArgs(): Map<number, any> {
    return this.boundArgs_;
  }

  get ctor(): gs.ICtor<any> {
    return this.ctor_;
  }
}


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
class Injector {
  private static BINDINGS_: Map<BindKey, BindInfo_> = new Map<BindKey, BindInfo_>();
  private static __metadata: symbol = Symbol('injectMetadata');

  private instances_: Map<BindKey, any>;

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
  getBoundValue(bindKey: BindKey): any {
    if (this.instances_.has(bindKey)) {
      return this.instances_.get(bindKey);
    }

    Asserts.map(Injector.BINDINGS_).to.containKey(bindKey)
        .orThrowsMessage(`No value bound to key ${bindKey}`);
    let bindInfo = Injector.BINDINGS_.get(bindKey);
    let ctor = bindInfo.ctor;
    let extraArgs = bindInfo.boundArgs;
    let metadata = ctor[Injector.__metadata] || new Map<number, BindKey>();

    // Collects the arguments.
    let args = [];
    for (let i = 0; i < ctor.length; i++) {
      if (extraArgs.has(i)) {
        args.push(extraArgs.get(i));
      } else {
        Asserts.map(metadata).to.containKey(i).orThrowsMessage(
          `Cannot find injection candidate for index ${i} for ${ctor} when getting ${bindKey}`);
          args.push(this.getBoundValue(metadata.get(i)));
      }
    }

    let instance = Reflect.construct(ctor, args);
    this.instances_.set(bindKey, instance);

    return instance;
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
  instantiate<T>(ctor: gs.ICtor<T>, extraArguments: { [index: number]: any } = {}): T {
    let metadata = ctor[Injector.__metadata] || new Map<number, BindKey>();

    // Collects the arguments.
    let args = [];
    for (let i = 0; i < ctor.length; i++) {
      let arg = undefined;
      if (extraArguments[i] !== undefined) {
        arg = extraArguments[i];
      } else {
        Asserts.map(metadata).to.containKey(i).orThrowsMessage(
            `Cannot find injection candidate for index ${i} for ${ctor} when instantiating`);
        arg = this.getBoundValue(metadata.get(i));
      }
      args.push(arg);
    }

    return Reflect.construct(ctor, args);
  }

  /**
   * Binds the given constructor to the given bind key.
   *
   * @param ctor The constructor to bind.
   * @param bindKey The key to bind the constructor to.
   * @param extraArguments Additional bindings to be added to the constructor. This is the same
   *    as calling `bind` on the ctor, except that due to how `@Inject` is implemented, `bind` does
   *    not work.
   */
  static bind(
      ctor: gs.ICtor<any>,
      bindKey: BindKey,
      extraArguments: { [index: number]: any } = {}): void {
    Asserts.map(Injector.BINDINGS_).toNot.containKey(bindKey)
        .orThrowsMessage(`Binding ${bindKey} is already bound`);
    Asserts.any(bindKey).toNot.beEqual(INJECTOR_BIND_KEY_)
        .orThrowsMessage(`${INJECTOR_BIND_KEY_} is a reserved key`);

    Injector.BINDINGS_.set(
        bindKey,
        new BindInfo_(ctor, Maps.fromNumericalIndexed<any>(extraArguments).data));
  }

  /**
   * Registers the injection point.
   *
   * @param bindKey The binding key to use to inject for the constructor.
   * @param ctor The constructor to register the injection point for.
   * @param index The index of the parameter to inject the value into.
   */
  static registerInject(bindKey: BindKey, ctor: gs.ICtor<any>, index: number): void {
    if (ctor[Injector.__metadata] === undefined) {
      ctor[Injector.__metadata] = new Map<number, BindKey>();
    }

    Asserts.map(ctor[Injector.__metadata]).toNot.containKey(index)
        .orThrowsMessage(`Injection for index ${index} for object ${ctor} already exists`);
    ctor[Injector.__metadata].set(index, bindKey);
  }
}

export default Injector;
