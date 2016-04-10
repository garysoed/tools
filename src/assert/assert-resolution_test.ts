import TestBase from '../test-base';
TestBase.setup();

import AssertResolution from './assert-resolution';


describe('assert.AssertResolution', () => {
  describe('orThrows', () => {
    it('should throw the given error if the assertion did not pass and not reversed', () => {
      let error = Error('error');
      let resolution = new AssertResolution(false, false);
      expect(() => {
        resolution.orThrows(error);
      }).toThrow(error);
    });

    it('should not throw if the assertion passes and not reversed', () => {
      let resolution = new AssertResolution(true, false);
      expect(() => {
        resolution.orThrows(Error('error'));
      }).not.toThrow();
    });

    it('should not throw if the assertion did not pass and reversed', () => {
      let resolution = new AssertResolution(false, true);
      expect(() => {
        resolution.orThrows(Error('error'));
      }).not.toThrow();
    });

    it('should throw the given error if the assertion passes and reversed', () => {
      let error = Error('error');
      let resolution = new AssertResolution(true, true);
      expect(() => {
        resolution.orThrows(error);
      }).toThrow(error);
    });
  });

  describe('orThrowsMessage', () => {
    it('should throw error with the given message if the assertion did not pass and not reversed',
        () => {
          let message = 'message';
          let resolution = new AssertResolution(false, false);
          expect(() => {
            resolution.orThrowsMessage(message);
          }).toThrowError(message);
        });

    it('should not throw if the assertion passes and not reversed', () => {
      let resolution = new AssertResolution(true, false);
      expect(() => {
        resolution.orThrowsMessage('message');
      }).not.toThrow();
    });

    it('should not throw if the assertion did not pass and reversed',
        () => {
          let resolution = new AssertResolution(false, true);
          expect(() => {
            resolution.orThrowsMessage('message');
          }).not.toThrow();
        });

    it('should throw error with the given message if the assertion passes and reversed', () => {
      let message = 'message';
      let resolution = new AssertResolution(true, true);
      expect(() => {
        resolution.orThrowsMessage(message);
      }).toThrowError(message);
    });
  });
});
