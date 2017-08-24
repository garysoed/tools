import { Injector } from './injector';

/**
 * Marks the given class as injectable.
 *
 * This accepts an optional name. If given, the class will be bound using that name. Otherwise, the
 * class will use the class' name. Due to possible class renaming done by the compiler, it is
 * suggested to always explicitly specify the name.
 *
 * @param name Name to bind the class to.
 * @param dependencies Dependencies of constructors to load.
 */
export function bind(name: (string|null) = null, _: any[] = []): ClassDecorator {
  return function(ctor: Function): void {
    const ctorName = name || ctor['name'];
    Injector.bind(ctor as gs.ICtor<any>, ctorName);
  };
}
