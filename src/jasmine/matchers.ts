export class Matchers {
  static any<T>(ctor: (new (...args: any[]) => T)): T {
    return <T> <any> jasmine.any(ctor);
  }
}
