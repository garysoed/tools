/**
 * Reflection utility methods.
 *
 * This is a wrapper around the standard Reflect library as it adds more features.
 */
export class Reflect {
  /**
   * Symbol on a class to reference a static function to initialize instances of that class. The
   * function should accept the instance to be initialized.
   * @static
   */
  static __initialize: symbol = Symbol('initialize');

  /**
   * Constructs a new instance of the constructor with the given arguments. If the constructor has
   * a function referenced by the `__initialize` symbol, that function will be called with the
   * new instance as its input argument.
   *
   * @param ctor The constructor to construct a new instance of.
   * @param args Arguments to apply to the constructor.
   * @return The new instance created from the constructor.
   */
  static construct(ctor: gs.ICtor<any>, args: any[]): any {
    let instance = new (ctor.bind.apply(ctor, [null].concat(args)));
    if (ctor[Reflect.__initialize] instanceof Function) {
      ctor[Reflect.__initialize](instance);
    }
    return instance;
  }

  /**
   * Overrides the getter of the given object.
   *
   * @param object The object whose getter property should be overridden.
   * @param propertyName Name of the getter property to be overridden.
   * @param newValue The new value returned by the getter.
   */
  static overrideGetter(object: any, propertyName: string, newValue: any): void {
    Object.defineProperty(object, propertyName, { get: (): any => newValue });
  }
}
