export class Matchers {
  static any<T>(ctor: (new (...args: any[]) => T)): T {
    return <T> <any> jasmine.any(ctor);
  }

  static anyInstanceOf<T>(obj: T): T {
    return <T> <any> jasmine.any(obj.constructor);
  }

  static anyThing(): any {
    return jasmine.anything();
  }

  static arrayContaining<T>(obj: T[]): T[] {
    return <T[]> <any> jasmine.arrayContaining(obj);
  }

  static objectContaining(obj: any): any {
    return jasmine.objectContaining(obj);
  }

  static stringMatching(regexp: RegExp): string {
    return <string> <any> jasmine.stringMatching(regexp);
  }
}

// TODO: anyTypeof
// TODO: anyNumberCloseTo
