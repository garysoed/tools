import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BaseListener } from '../event/base-listener';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { hash } from '../util/hash';


describe('event.BaseListener', () => {
  let context;
  let listener: BaseListener;

  beforeEach(() => {
    context = Mocks.object('context');
    listener = new BaseListener(context);
    TestDispose.add(listener);
  });

  describe('ctor', () => {
    it('should default the context to current object if not given', () => {
      listener = new BaseListener();
      TestDispose.add(listener);
      assert(listener['context_']).to.equal(listener);
    });
  });

  describe('disposeInternal', () => {
    it('should dispose all the deregister functions', () => {
      const mockDeregister1 = jasmine.createSpyObj('Deregister1', ['dispose']);
      const mockDeregister2 = jasmine.createSpyObj('Deregister2', ['dispose']);
      listener['deregisterFns_'].set('hash1', mockDeregister1);
      listener['deregisterFns_'].set('hash2', mockDeregister2);
      listener.dispose();
      assert(mockDeregister1.dispose).to.haveBeenCalledWith();
      assert(mockDeregister2.dispose).to.haveBeenCalledWith();
    });
  });

  describe('getHash_', () => {
    it('should return the correct hash', () => {
      const listenable = Mocks.object('listenable');
      const eventType = 'eventType';
      const callback = Mocks.object('callback');
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
    it('should listen to the listenable correctly and return the deregister function', () => {
      const mockDeregister = jasmine.createSpyObj('Deregister', ['dispose']);
      const mockListenable = jasmine.createSpyObj('Listenable', ['on']);
      mockListenable.on.and.returnValue(mockDeregister);

      const eventType = 'eventType';
      const callback = Mocks.object('callback');
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

    it('should not listen to the listenable and return the deregister function if already ' +
        'listened to',
        () => {
          const mockListenable = jasmine.createSpyObj('Listenable', ['on']);

          const eventType = 'eventType';
          const callback = Mocks.object('callback');
          const useCapture = false;
          const hashValue = 'hashValue';
          spyOn(listener, 'getHash_').and.returnValue(hashValue);

          const mockDeregister = jasmine.createSpyObj('Deregister', ['dispose']);
          listener['deregisterFns_'].set(hashValue, mockDeregister);

          assert(listener.listenTo(mockListenable, eventType, callback, useCapture)).to
              .equal(mockDeregister);
          assert(mockListenable.on).toNot.haveBeenCalled();
          assert(listener['getHash_']).to
              .haveBeenCalledWith(mockListenable, eventType, callback, useCapture);
        });
  });

  describe('unlistenFrom', () => {
    it('should deregister the corresponding deregister', () => {
      const listenable = Mocks.object('listenable');

      const eventType = 'eventType';
      const callback = Mocks.object('callback');
      const useCapture = false;
      const hashValue = 'hashValue';
      spyOn(listener, 'getHash_').and.returnValue(hashValue);

      const mockDeregister = jasmine.createSpyObj('Deregister', ['dispose']);
      listener['deregisterFns_'].set(hashValue, mockDeregister);

      listener.unlistenFrom(listenable, eventType, callback, useCapture);
      assert(listener['deregisterFns_']).to.haveEntries([]);
      assert(mockDeregister.dispose).to.haveBeenCalledWith();
      assert(listener['getHash_']).to
          .haveBeenCalledWith(listenable, eventType, callback, useCapture);
    });

    it('should not throw error if there are no corresponding deregisters', () => {
      const listenable = Mocks.object('listenable');

      const eventType = 'eventType';
      const callback = Mocks.object('callback');
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
