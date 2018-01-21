import { ImmutableList } from '../immutable';

export abstract class Path {
  static readonly SEPARATOR: string = '/';

  private readonly parts_: ImmutableList<string>;

  constructor(parts: Iterable<string>) {
    this.parts_ = ImmutableList.of([...parts]);
  }

  getParts(): ImmutableList<string> {
    return this.parts_;
  }
}
