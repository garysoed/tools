import BaseDisposable from '../dispose/base-disposable';
import DisposableFunction from '../dispose/disposable-function';
import MockElement from './mock-element';


const __id = Symbol('id');

/**
 * Contains various utility methods to create mocks for testing.
 */
class Mocks {
  /**
   * Creates a mock builder.
   *
   * Each method of the builder returns the instance of the builder.
   * @param name Name to identify the mock.
   * @param methods Name of builder methods to generate.
   * @return The mock builder object.
   */
  static builder(name: string, methods: string[]): any {
    let baseObj = Mocks.object(name);
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
  static disposable(): any {
    return new BaseDisposable();
  }

  /**
   * Creates a mock element.
   *
   * @param queries Used to implement [[querySelector]]. The key is the query, and the value is the
   *    value(s) to return for the query.
   * @return The mock element object.
   */
  static element(queries: { [query: string]: any}): any {
    return new MockElement(queries);
  }

  /**
   * Creates a mock listenable.
   *
   * @param name Name to identify the mock object.
   * @return The mock listenable object.
   */
  static listenable(name: string): any {
    let mock = Mocks.object(name);
    mock.on = () => {
      return new DisposableFunction(() => undefined);
    };
    mock.dispatch = () => undefined;
    return mock;
  }

  /**
   * Creates a mock object.
   *
   * @param name Name to identify the mock object.
   * @return The mock object instance.
   */
  static object(name: string): any {
    return { [__id]: name };
  }
};

export default Mocks;
