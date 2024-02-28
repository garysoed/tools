import {WorkerGlobalScopeLike, WorkerLike} from 'gs-testing/export/fake';
import {Observable, fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';

import {Channel} from './channel';

export interface WorkerPayload {
  readonly payload: {};
  readonly transfers?: readonly Transferable[];
}

export function workerClientChannel(
  worker: WorkerLike,
): Channel<WorkerPayload> {
  return {
    onMessage$: fromEvent<MessageEvent>(worker, 'message').pipe(
      map((event) => ({payload: event.data})),
    ),
    send: (message: WorkerPayload): void => {
      worker.postMessage(message.payload, [...(message.transfers ?? [])]);
    },
  };
}

export function workerServerChannel(
  global: WorkerGlobalScopeLike,
  onMessage$: Observable<MessageEvent>,
): Channel<WorkerPayload> {
  return {
    onMessage$: onMessage$.pipe(map((event) => ({payload: event.data}))),
    send: (message: WorkerPayload): void => {
      global.postMessage(message.payload);
    },
  };
}
