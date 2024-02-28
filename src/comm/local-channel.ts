import {Subject} from 'rxjs';

import {Channel} from './channel';

export function localChannel<T>(): Channel<T> {
  const onMessage$ = new Subject<T>();
  return {
    onMessage$,
    send: (message: T) => {
      onMessage$.next(message);
    },
  };
}
