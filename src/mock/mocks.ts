import MockElement from './mock-element';


const __id = Symbol('id');

export default {
  element(queries: { [query: string]: any}): any {
    return new MockElement(queries);
  },

  object(name: string): any {
    return { [__id]: name };
  },
};
