import Injector from './injector';


/**
 * Marks the given class as injectable.
 *
 * This accepts an optional name. If given, the class will be bound using that name. Otherwise, the
 * class will use the class' name. Due to possible class renaming done by the compiler, it is
 * suggested to always explicitly specify the name.
 *
 * @param name Name to bind the class to.
 */
function Bind(name: string = null): ClassDecorator {
  return function<C extends gs.ICtor<any>>(ctor: C): void {
    let ctorName = name || ctor['name'];
    Injector.bind(ctor, ctorName);
  };
};

export default Bind;