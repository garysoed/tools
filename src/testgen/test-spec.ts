import { ImmutableList } from '../immutable/immutable-list';

export class TestSpec<V> {

  constructor(readonly values: ImmutableList<V>) { }

  or<V2>(spec: TestSpec<V2>): TestSpec<V | V2> {
    return new TestSpec(ImmutableList
        .of<V | V2>([])
        .addAll(this.values)
        .addAll(spec.values));
  }

  static of<V>(arrayValues: V[]): TestSpec<V> {
    return new TestSpec(ImmutableList.of(arrayValues));
  }
}
