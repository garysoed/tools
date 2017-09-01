import { MonadSetter, MonadValue } from '../interfaces';

let ID: number = 0;
// TODO: DELETE
export class FakeMonadSetter<T> implements MonadSetter<T> {
  private readonly id_: number;

  constructor(readonly value: T) {
    this.id_ = ID++;
  }

  findValue(values: Iterable<MonadValue<T>>): MonadValue<T> | null {
    for (const value of values) {
      if (value.id === this.id_) {
        return value;
      }
    }

    return null;
  }

  set(newValue: T): MonadValue<T> {
    return {
      id: this.id_,
      value: newValue,
    };
  }
}
