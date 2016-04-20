declare module jasmine {
  interface Calls {
    firstArgsMatching(...args: any[]): any[];
  }
}
