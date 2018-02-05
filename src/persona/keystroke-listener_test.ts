import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { KeystrokeListener, Options } from '../persona/keystroke-listener';


describe('persona.KeystrokeListener', () => {
  const KEY = 'key';
  let options: Options;
  let listener: KeystrokeListener;

  beforeEach(() => {
    options = {};
    listener = new KeystrokeListener(KEY, options, Mocks.object('elementSelector'));
  });

  describe('matches_', () => {
    it(`should return true if the key, alt, meta, ctrl match`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;
      options.alt = true;
      options.ctrl = true;
      options.meta = true;

      assert(listener['matches_'](event)).to.beTrue();
    });

    it(`should return false if the key doesn't match`, () => {
      const event = {altKey: true, ctrlKey: true, key: 'other', metaKey: true} as KeyboardEvent;
      options.alt = true;
      options.ctrl = true;
      options.meta = true;

      assert(listener['matches_'](event)).to.beFalse();
    });

    it(`should return false if the meta doesn't match`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;
      options.alt = true;
      options.ctrl = true;
      options.meta = false;

      assert(listener['matches_'](event)).to.beFalse();
    });

    it(`should ignore the meta if undefined`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;
      options.alt = true;
      options.ctrl = true;

      assert(listener['matches_'](event)).to.beTrue();
    });

    it(`should return false if the ctrl doesn't match`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;
      options.alt = true;
      options.ctrl = false;

      assert(listener['matches_'](event)).to.beFalse();
    });

    it(`should ignore the ctrl if undefined`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;
      options.alt = true;

      assert(listener['matches_'](event)).to.beTrue();
    });

    it(`should return false if the alt doesn't match`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;
      options.alt = false;

      assert(listener['matches_'](event)).to.beFalse();
    });

    it(`should ignore the alt if undefined`, () => {
      const event = {altKey: true, ctrlKey: true, key: KEY, metaKey: true} as KeyboardEvent;

      assert(listener['matches_'](event)).to.beTrue();
    });
  });

  describe('start', () => {
    it(`should start correctly`, () => {
      const root = Mocks.object('root');
      const mockHandler = jasmine.createSpy('Handler');
      const context = Mocks.object('context');
      const useCapture = true;
      const disposable = Mocks.object('disposable');

      const startSpy = spyOn(listener['eventListener_'], 'start').and.returnValue(disposable);
      spyOn(listener, 'matches_').and.returnValue(true);

      assert(listener.start(root, mockHandler, context, useCapture)).to.equal(disposable);
      assert(listener['eventListener_'].start).to.haveBeenCalledWith(
          root,
          Matchers.anyFunction(),
          context,
          useCapture);

      const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
      Object.setPrototypeOf(mockEvent, KeyboardEvent.prototype);
      startSpy.calls.argsFor(0)[1](mockEvent);
      assert(mockEvent.stopPropagation).to.haveBeenCalledWith();
      assert(mockHandler).to.haveBeenCalledWith({type: 'keystroke'});
      assert(listener['matches_']).to.haveBeenCalledWith(mockEvent);
    });

    it(`should not call the handler if the event doesn't match the spec`, () => {
      const root = Mocks.object('root');
      const mockHandler = jasmine.createSpy('Handler');
      const context = Mocks.object('context');
      const useCapture = true;
      const disposable = Mocks.object('disposable');

      const startSpy = spyOn(listener['eventListener_'], 'start').and.returnValue(disposable);
      spyOn(listener, 'matches_').and.returnValue(false);

      assert(listener.start(root, mockHandler, context, useCapture)).to.equal(disposable);
      assert(listener['eventListener_'].start).to.haveBeenCalledWith(
          root,
          Matchers.anyFunction(),
          context,
          useCapture);

      const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
      Object.setPrototypeOf(mockEvent, KeyboardEvent.prototype);
      startSpy.calls.argsFor(0)[1](mockEvent);
      assert(mockEvent.stopPropagation).toNot.haveBeenCalled();
      assert(mockHandler).toNot.haveBeenCalledWith();
      assert(listener['matches_']).to.haveBeenCalledWith(mockEvent);
    });
  });
});
