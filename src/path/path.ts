import { createImmutableList, ImmutableList } from '../collection/types/immutable-list';

export abstract class Path {
  static readonly SEPARATOR: string = '/';

  private readonly parts_: ImmutableList<string>;

  constructor(parts: Iterable<string>) {
    this.parts_ = createImmutableList([...parts]);
  }

  getParts(): ImmutableList<string> {
    return this.parts_;
  }
}
