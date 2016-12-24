export class Matchers {
  static any<T>(ctor: (new (...args: any[]) => T)): T {
    return <T> <any> jasmine.any(ctor);
  }

  static anyInstanceOf<T>(obj: T): T {
    return <T> <any> jasmine.any(obj.constructor);
  }

  static stringMatching(regexp: RegExp): string {
    return <string> <any> jasmine.stringMatching(regexp);
  }
}
