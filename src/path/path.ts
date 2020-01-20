export abstract class Path {
  static readonly SEPARATOR: string = '/';

  private readonly parts_: readonly string[];

  constructor(parts: Iterable<string>) {
    this.parts_ = [...parts];
  }

  getParts(): readonly string[] {
    return this.parts_;
  }
}
