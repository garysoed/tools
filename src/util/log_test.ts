import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Log } from './log';


describe('util.Log', () => {
  beforeEach(() => {
    Log.setEnabled(true);
  });

  describe('callIfEnabled_', () => {
    it('should call the given function if logging is enabled', () => {
      const message = 'message';
      const namespace = 'namespace';
      const callback = jasmine.createSpy('callback');

      Log.setEnabled(true);
      const log = new Log(namespace);
      log['callIfEnabled_'](callback, message);

      assert(callback).to.haveBeenCalledWith(`[${namespace}] ${message}`);
    });

    it('should do nothing if logging is disabled', () => {
      const callback = jasmine.createSpy('callback');

      Log.setEnabled(false);
      const log = new Log('namespace');
      log['callIfEnabled_'](callback, 'message');

      assert(callback).toNot.haveBeenCalled();
    });
  });

  describe('error', () => {
    it('should call console.error', () => {
      const message = 'message';

      spyOn(console, 'error');

      const log = new Log('namespace');
      const spy = spyOn(log, 'callIfEnabled_');

      Log.error(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(Matchers.any(Function) as any, message);

      spy.calls.argsFor(0)[0](message);
      assert(console.error).to.haveBeenCalledWith(message);
    });
  });

  describe('info', () => {
    it('should call console.info', () => {
      const message = 'message';

      spyOn(console, 'info');

      const log = new Log('namespace');
      const spy = spyOn(log, 'callIfEnabled_');

      Log.info(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(Matchers.any(Function) as any, message);

      spy.calls.argsFor(0)[0](message);
      assert(console.info).to.haveBeenCalledWith(message);
    });
  });

  describe('warn', () => {
    it('should call console.warn', () => {
      const message = 'message';

      spyOn(console, 'warn');

      const log = new Log('namespace');
      const spy = spyOn(log, 'callIfEnabled_');

      Log.warn(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(Matchers.any(Function) as any, message);

      spy.calls.argsFor(0)[0](message);
      assert(console.warn).to.haveBeenCalledWith(message);
    });
  });
});
