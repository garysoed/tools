export class Matchers {
  static any<T>(ctor: (new (...args: any[]) => T)): T {
    return jasmine.any(ctor) as any as T;
  }

  static anyFunction<R>(): () => R;
  static anyFunction<P1, R>(): (arg1: P1) => R;
  static anyFunction(): any {
    return jasmine.any(Function);
  }

  static anyInstanceOf<T>(obj: T): T {
    return jasmine.any(obj.constructor) as any as T;
  }

  static anyString(): string {
    return jasmine.any(String) as any as string;
  }

  static anyThing(): any {
    return jasmine.anything();
  }

  static arrayContaining<T>(obj: T[]): T[] {
    return jasmine.arrayContaining(obj) as any as T[];
  }

  static objectContaining(obj: any): any {
    return jasmine.objectContaining(obj);
  }

  static stringMatching(regexp: RegExp): string {
    return jasmine.stringMatching(regexp) as any as string;
  }
}

// TODO: anyTypeof
// TODO: anyNumberCloseTo
