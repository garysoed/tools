import MockElement from './mock-element';


const __id = Symbol('id');

const Mocks = {
  builder(name: string, methods: string[]): any {
    let baseObj = Mocks.object(name);
    methods.forEach((method: string) => {
      baseObj[method] = () => {
        return baseObj;
      };
    });
    return baseObj;
  },

  element(queries: { [query: string]: any}): any {
    return new MockElement(queries);
  },

  object(name: string): any {
    return { [__id]: name };
  },
};

export default Mocks;
