export class Matchers {
  static any<T>(ctor: (new (...args: any[]) => T)): T {
    return jasmine.any(ctor) as any as T;
  }

  static anyInstanceOf<T>(obj: T): T {
    return jasmine.any(obj.constructor) as any as T;
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
// TODO: Mutable
