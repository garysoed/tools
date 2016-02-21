const __id = Symbol('id');

export default {
  object(name: string): any {
    return { [__id]: name };
  },
};
