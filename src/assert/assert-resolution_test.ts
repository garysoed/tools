import TestBase from '../test-base';
TestBase.setup();

import AssertResolution from './assert-resolution';


describe('assert.AssertResolution', () => {
  describe('orThrows', () => {
    it('should throw the given error if the assertion did not pass', () => {
      let error = Error('error');
      let resolution = new AssertResolution(false);
      expect(() => {
        resolution.orThrows(error);
      }).toThrow(error);
    });

    it('should not throw if the assertion passes', () => {
      let resolution = new AssertResolution(true);
      expect(() => {
        resolution.orThrows(Error('error'));
      }).not.toThrow();
    });
  });

  describe('orThrowsMessage', () => {
    it('should throw error with the given message if the assertion did not pass', () => {
      let message = 'message';
      let resolution = new AssertResolution(false);
      expect(() => {
        resolution.orThrowsMessage(message);
      }).toThrowError(message);
    });

    it('should not throw if the assertion passes', () => {
      let resolution = new AssertResolution(true);
      expect(() => {
        resolution.orThrowsMessage('message');
      }).not.toThrow();
    });
  });
});
