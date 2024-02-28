import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class ArraySubject<T> extends BehaviorSubject<readonly T[]> {
  constructor(initValue?: readonly T[]) {
    super(initValue ?? []);
  }

  get(index: number): Observable<T | undefined> {
    return this.pipe(map((array) => array[index]));
  }

  push(...items: readonly T[]): void {
    this.update((newArray) => {
      newArray.push(...items);
      return newArray;
    });
  }

  set(index: number, value: T): void {
    this.update((newArray) => {
      newArray[index] = value;
      return newArray;
    });
  }

  private update(modifierFn: (input: T[]) => readonly T[]): void {
    const value = this.getValue();
    this.next(modifierFn([...value]));
  }
}
