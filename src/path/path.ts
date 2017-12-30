import { ImmutableList } from '../immutable';

export abstract class Path {
  static readonly SEPARATOR: string = '/';

  constructor(private readonly parts_: ImmutableList<string>) { }

  getParts(): ImmutableList<string> {
    return this.parts_;
  }
}
