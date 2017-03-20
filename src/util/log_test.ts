import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Log } from './log';


describe('util.Log', () => {
  beforeEach(() => {
    Log.setEnabled(true);
  });

  describe('callIfEnabled_', () => {
    it('should call the given function if logging is enabled', () => {
      let message = 'message';
      let namespace = 'namespace';
      let callback = jasmine.createSpy('callback');

      Log.setEnabled(true);
      let log = new Log(namespace);
      log['callIfEnabled_'](callback, message);

      assert(callback).to.haveBeenCalledWith(`[${namespace}] ${message}`);
    });

    it('should do nothing if logging is disabled', () => {
      let callback = jasmine.createSpy('callback');

      Log.setEnabled(false);
      let log = new Log('namespace');
      log['callIfEnabled_'](callback, 'message');

      assert(callback).toNot.haveBeenCalled();
    });
  });

  describe('error', () => {
    it('should call console.error', () => {
      let message = 'message';

      spyOn(console, 'error');

      let log = new Log('namespace');
      let spy = spyOn(log, 'callIfEnabled_');

      Log.error(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(<any> Matchers.any(Function), message);

      spy.calls.argsFor(0)[0](message);
      assert(console.error).to.haveBeenCalledWith(message);
    });
  });

  describe('info', () => {
    it('should call console.info', () => {
      let message = 'message';

      spyOn(console, 'info');

      let log = new Log('namespace');
      let spy = spyOn(log, 'callIfEnabled_');

      Log.info(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(<any> Matchers.any(Function), message);

      spy.calls.argsFor(0)[0](message);
      assert(console.info).to.haveBeenCalledWith(message);
    });
  });

  describe('warn', () => {
    it('should call console.warn', () => {
      let message = 'message';

      spyOn(console, 'warn');

      let log = new Log('namespace');
      let spy = spyOn(log, 'callIfEnabled_');

      Log.warn(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(<any> Matchers.any(Function), message);

      spy.calls.argsFor(0)[0](message);
      assert(console.warn).to.haveBeenCalledWith(message);
    });
  });
});
