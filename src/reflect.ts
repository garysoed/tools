/**
 * Reflection utility methods.
 *
 * This is a wrapper around the standard Reflect library as it adds more features.
 */
class Reflect {
  /**
   * Constructs a new instance of the constructor with the given arguments.
   *
   * @param ctor The constructor to construct a new instance of.
   * @param args Arguments to apply to the constructor.
   * @return The new instance created from the constructor.
   */
  static construct(ctor: gs.ICtor<any>, args: any[]): any {
    return new (ctor.bind.apply(ctor, [null].concat(args)));
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

export default Reflect;
