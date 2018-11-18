import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { mockObject } from 'gs-testing/export/mock';
import { BaseListener } from '../event/base-listener';
import { TestDispose } from '../testing/test-dispose';
import { hash } from '../util/hash';


describe('event.BaseListener', () => {
  let context;
  let listener: BaseListener;

  beforeEach(() => {
    context = mockObject('context');
    listener = new BaseListener(context);
    TestDispose.add(listener);
  });

  describe('ctor', () => {
    should('default the context to current object if not given', () => {
      listener = new BaseListener();
      TestDispose.add(listener);
      assert(listener['context_']).to.equal(listener);
    });
  });

  describe('disposeInternal', () => {
    should('dispose all the deregister functions', () => {
      const mockDeregister1 = createSpyObject('Deregister1', ['dispose']);
      const mockDeregister2 = createSpyObject('Deregister2', ['dispose']);
      listener['deregisterFns_'].set('hash1', mockDeregister1);
      listener['deregisterFns_'].set('hash2', mockDeregister2);
      listener.dispose();
      assert(mockDeregister1.dispose).to.haveBeenCalledWith();
      assert(mockDeregister2.dispose).to.haveBeenCalledWith();
    });
  });

  describe('getHash_', () => {
    should('return the correct hash', () => {
      const listenable = mockObject('listenable');
      const eventType = 'eventType';
      const callback = mockObject('callback');
      const useCapture = true;

      const hashListenable = hash(listenable);
      const hashEventType = hash(eventType);
      const hashCallback = hash(callback);
      const hashUseCapture = hash(useCapture);

      assert(listener['getHash_'](listenable, eventType, callback, useCapture))
          .to.equal(`${hashListenable}_${hashEventType}_${hashCallback}_${hashUseCapture}`);
    });
  });

  describe('listenTo', () => {
    should('listen to the listenable correctly and return the deregister function', () => {
      const mockDeregister = createSpyObject('Deregister', ['dispose']);
      const mockListenable = createSpyObject('Listenable', ['on']);
      mockListenable.on.and.returnValue(mockDeregister);

      const eventType = 'eventType';
      const callback = mockObject('callback');
      const useCapture = false;
      const hashValue = 'hashValue';
      spyOn(listener, 'getHash_').and.returnValue(hashValue);

      assert(listener.listenTo(mockListenable, eventType, callback, useCapture)).to
          .equal(mockDeregister);
      assert(listener['deregisterFns_']).to.haveEntries([[hashValue, mockDeregister]]);
      assert(mockListenable.on).to
          .haveBeenCalledWith(eventType, callback, listener['context_'], useCapture);
      assert(listener['getHash_']).to
          .haveBeenCalledWith(mockListenable, eventType, callback, useCapture);
    });

    should('not listen to the listenable and return the deregister function if already ' +
        'listened to',
        () => {
          const mockListenable = createSpyObject('Listenable', ['on']);

          const eventType = 'eventType';
          const callback = mockObject('callback');
          const useCapture = false;
          const hashValue = 'hashValue';
          spyOn(listener, 'getHash_').and.returnValue(hashValue);

          const mockDeregister = createSpyObject('Deregister', ['dispose']);
          listener['deregisterFns_'].set(hashValue, mockDeregister);

          assert(listener.listenTo(mockListenable, eventType, callback, useCapture)).to
              .equal(mockDeregister);
          assert(mockListenable.on).toNot.haveBeenCalled();
          assert(listener['getHash_']).to
              .haveBeenCalledWith(mockListenable, eventType, callback, useCapture);
        });
  });

  describe('unlistenFrom', () => {
    should('deregister the corresponding deregister', () => {
      const listenable = mockObject('listenable');

      const eventType = 'eventType';
      const callback = mockObject('callback');
      const useCapture = false;
      const hashValue = 'hashValue';
      spyOn(listener, 'getHash_').and.returnValue(hashValue);

      const mockDeregister = createSpyObject('Deregister', ['dispose']);
      listener['deregisterFns_'].set(hashValue, mockDeregister);

      listener.unlistenFrom(listenable, eventType, callback, useCapture);
      assert(listener['deregisterFns_']).to.haveEntries([]);
      assert(mockDeregister.dispose).to.haveBeenCalledWith();
      assert(listener['getHash_']).to
          .haveBeenCalledWith(listenable, eventType, callback, useCapture);
    });

    should('not throw error if there are no corresponding deregisters', () => {
      const listenable = mockObject('listenable');

      const eventType = 'eventType';
      const callback = mockObject('callback');
      const useCapture = false;
      spyOn(listener, 'getHash_').and.returnValue('hashValue');

      assert(() => {
        listener.unlistenFrom(listenable, eventType, callback, useCapture);
      }).toNot.throw();
      assert(listener['getHash_']).to
          .haveBeenCalledWith(listenable, eventType, callback, useCapture);
    });
  });
});
