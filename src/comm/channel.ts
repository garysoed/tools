import {Observable} from 'rxjs';

export interface Channel<T> {
  readonly onMessage$: Observable<T>;

  send(message: T): void;
}
