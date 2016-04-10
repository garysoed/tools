import TestBase from './test-base';
TestBase.setup();

import Log from './log';


describe('Log', () => {
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

      expect(callback).toHaveBeenCalledWith(`[${namespace}] ${message}`);
    });

    it('should do nothing if logging is disabled', () => {
      let callback = jasmine.createSpy('callback');

      Log.setEnabled(false);
      let log = new Log('namespace');
      log['callIfEnabled_'](callback, 'message');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should call console.info', () => {
      let message = 'message';

      spyOn(console, 'info');

      let log = new Log('namespace');
      let spy = spyOn(log, 'callIfEnabled_');

      log.info(message);

      expect(log['callIfEnabled_']).toHaveBeenCalledWith(jasmine.any(Function), message);

      spy.calls.argsFor(0)[0](message);
      expect(console.info).toHaveBeenCalledWith(message);
    });
  });
});
