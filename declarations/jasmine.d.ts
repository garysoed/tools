declare function spy(object: any, method: string | symbol): jasmine.Spy;

declare module jasmine {
  interface Calls {
    firstArgsMatching(...args: any[]): any[];
  }

  interface SpyAnd {
    returnValues(...val: any[]): Spy;
  }
}
