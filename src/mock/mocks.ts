import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction } from '../dispose/disposable-function';


/**
 * @hidden
 */
const __id = Symbol('id');

/**
 * Contains various utility methods to create mocks for testing.
 */
export class Mocks {
  /**
   * Creates a mock builder.
   *
   * Each method of the builder returns the instance of the builder.
   * @param name Name to identify the mock.
   * @param methods Name of builder methods to generate.
   * @return The mock builder object.
   */
  static builder(name: string, methods: string[]): any {
    const baseObj = Mocks.object(name);
    methods.forEach((method: string) => {
      baseObj[method] = () => {
        return baseObj;
      };
    });
    return baseObj;
  }

  /**
   * Creates a mock disposable object.
   *
   * @return The mock disposable object.
   */
  static disposable(name: string): any {
    const mock = new BaseDisposable();
    mock[__id] = name;
    return mock;
  }

  static getter(target: any, name: string, value: any): void {
    Object.defineProperty(target, name, {
      get: () => value,
    });
  }

  /**
   * @param items Content of the list.
   * @return The mock element object.
   */
  static itemList<T>(items: T[]): {item: (index: number) => T, length: number} {
    return {
      length: items.length,
      item(index: number): T {
        return items[index];
      },
    };
  }

  /**
   * Creates a mock listenable.
   *
   * @param name Name to identify the mock object.
   * @return The mock listenable object.
   */
  static listenable(name: string, target?: any): any {
    const mock = Mocks.disposable(name);
    mock.on = () => {
      return new DisposableFunction(() => undefined);
    };
    mock.dispatch = () => undefined;
    mock.getEventTarget = () => target;
    return mock;
  }

  /**
   * Creates a mock object.
   *
   * @param name Name to identify the mock object.
   * @return The mock object instance.
   */
  static object(name: string): any {
    return {[__id]: name};
  }
}
// TODO: Mutable
