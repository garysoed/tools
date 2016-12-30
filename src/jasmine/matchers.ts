export class Matchers {
  static any<T>(ctor: (new (...args: any[]) => T)): T {
    return <T> <any> jasmine.any(ctor);
  }

  static anyInstanceOf<T>(obj: T): T {
    return <T> <any> jasmine.any(obj.constructor);
  }

  static objectContaining(obj: any): any {
    return jasmine.objectContaining(obj);
  }

  static stringMatching(regexp: RegExp): string {
    return <string> <any> jasmine.stringMatching(regexp);
  }
}
