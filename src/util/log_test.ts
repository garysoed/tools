import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Log, LogLevel } from '../util/log';


describe('util.Log', () => {
  beforeEach(() => {
    Log.setEnabledLevel(LogLevel.DEBUG);
  });

  describe('callIfEnabled_', () => {
    it('should call the given function if enabled logging level is lower than the level', () => {
      const color = 'color';
      const message = 'message';
      const namespace = 'namespace';
      const callback = jasmine.createSpy('callback');

      Log.setEnabledLevel(LogLevel.DEBUG);
      Log.setColorEnabled(true);
      const log = new Log(namespace);
      log['callIfEnabled_'](callback, LogLevel.ERROR, color, message);

      assert(callback).to
          .haveBeenCalledWith(`%c${namespace}%c`, `color: ${color}`, `color: default`, message);
    });

    it('should do nothing if logging is disabled', () => {
      const callback = jasmine.createSpy('callback');

      Log.setEnabledLevel(LogLevel.OFF);
      const log = new Log('namespace');
      log['callIfEnabled_'](callback, LogLevel.DEBUG, 'message');

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

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(
          Matchers.anyFunction(),
          LogLevel.ERROR,
          Matchers.anyString(),
          message);

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

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(
          Matchers.anyFunction(),
          LogLevel.INFO,
          Matchers.anyString(),
          message);

      spy.calls.argsFor(0)[0](message);
      assert(console.info).to.haveBeenCalledWith(message);
    });
  });

  describe('trace', () => {
    it('should call console.trace', () => {
      spyOn(console, 'trace');

      const log = new Log('namespace');
      const spy = spyOn(log, 'callIfEnabled_');

      Log.trace(log);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(
          Matchers.anyFunction(),
          LogLevel.DEBUG,
          Matchers.anyString());

      spy.calls.argsFor(0)[0]();
      assert(console.trace).to.haveBeenCalledWith();
    });
  });

  describe('warn', () => {
    it('should call console.warn', () => {
      const message = 'message';

      spyOn(console, 'warn');

      const log = new Log('namespace');
      const spy = spyOn(log, 'callIfEnabled_');

      Log.warn(log, message);

      assert(log['callIfEnabled_']).to.haveBeenCalledWith(
          Matchers.anyFunction(),
          LogLevel.WARNING,
          Matchers.anyString(),
          message);

      spy.calls.argsFor(0)[0](message);
      assert(console.warn).to.haveBeenCalledWith(message);
    });
  });
});
