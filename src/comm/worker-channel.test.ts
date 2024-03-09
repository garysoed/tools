import {assert, asyncAssert, objectThat, setup, should, test} from 'gs-testing';
import {createSpySubject} from 'gs-testing';
import {FakeWorker, FakeWorkerGlobalScope} from 'gs-testing/export/fake/dom';
import {Subject} from 'rxjs';

import {
  WorkerPayload,
  workerClientChannel,
  workerServerChannel,
} from './worker-channel';

test('@tools/src/comm/worker-channel', () => {
  test('workerClientChannel', () => {
    const _ = setup(() => {
      const fakeWorker = new FakeWorker();
      const channel = workerClientChannel(fakeWorker);
      return {channel, fakeWorker};
    });

    test('onMessage$', () => {
      should('emit the message data', async () => {
        const data = {a: 1};

        const onMessage$ = createSpySubject(_.channel.onMessage$);
        _.fakeWorker.dispatchEvent(new MessageEvent('message', {data}));

        await asyncAssert(onMessage$).to.emitWith(
          objectThat<WorkerPayload>().equal({payload: data}),
        );
      });
    });

    test('send', () => {
      should('post the message and set the transfers correctly', async () => {
        const data = {a: 1};
        const transferable1 = await createTestImageBitmap();
        const transferable2 = await createTestImageBitmap();

        const messageSent$ = createSpySubject(_.fakeWorker.onMessageSent$);
        _.channel.send({
          payload: data,
          transfers: [transferable1, transferable2],
        });

        await asyncAssert(messageSent$).to.emitWith(data);
        assert(_.fakeWorker.transferables).to.equal([
          transferable1,
          transferable2,
        ]);
      });
    });
  });

  test('workerServerChannel', () => {
    const _ = setup(() => {
      const fakeWorkerGlobalScope = new FakeWorkerGlobalScope();
      const onMessage$ = new Subject<MessageEvent>();
      const channel = workerServerChannel(fakeWorkerGlobalScope, onMessage$);
      return {channel, fakeWorkerGlobalScope, onMessage$};
    });

    test('onMessage$', () => {
      should('emit the message data', async () => {
        const data = {a: 1};

        const onMessage$ = createSpySubject(_.channel.onMessage$);
        _.onMessage$.next(new MessageEvent('message', {data}));

        await asyncAssert(onMessage$).to.emitWith(
          objectThat<WorkerPayload>().equal({payload: data}),
        );
      });
    });

    test('send', () => {
      should('post the message correctly', async () => {
        const data = {a: 1};

        const messageSent$ = createSpySubject(
          _.fakeWorkerGlobalScope.onMessageSent$,
        );
        _.channel.send({payload: data});

        await asyncAssert(messageSent$).to.emitWith(data);
      });
    });
  });
});

function createTestImageBitmap(): Promise<ImageBitmap> {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = 100;
  canvasEl.height = 100;
  return createImageBitmap(canvasEl);
}
