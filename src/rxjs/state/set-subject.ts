import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class SetSubject<T> extends BehaviorSubject<ReadonlySet<T>> {
  constructor(initValue?: ReadonlySet<T>) {
    super(initValue ?? new Set());
  }

  add(item: T): void {
    this.update(oldSet => {
      const newSet = new Set(oldSet);
      newSet.add(item);
      return newSet;
    });
  }

  delete(item: T): void {
    this.update(oldSet => {
      const newSet = new Set(oldSet);
      newSet.delete(item);
      return newSet;
    });
  }

  has(item: T): Observable<boolean> {
    return this.pipe(map(set => set.has(item)));
  }

  private update(modifierFn: (input: ReadonlySet<T>) => ReadonlySet<T>): void {
    const value = this.getValue();
    this.next(modifierFn(value));
  }
}

