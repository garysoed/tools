import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Locations} from './locations';


describe('ui.Locations', () => {
  describe('getParts_', () => {
    it('should split the normalized parts', () => {
      let path = 'path';
      let normalizedPath = '/a/./b/c';

      spyOn(Locations, 'normalizePath').and.returnValue(normalizedPath);

      assert(Locations['getParts_'](path)).to.equal(['', 'a', 'b', 'c']);
      assert(Locations.normalizePath).to.haveBeenCalledWith(path);
    });
  });

  describe('getMatches', () => {
    it('should return the correct matches', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(Locations, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return ['hello', '_', 'location'];
        }
      });

      assert(Locations.getMatches(hash, matcher)).to.equal({
        'a': 'hello',
        'b': 'location',
      });
      assert(Locations['getParts_']).to.haveBeenCalledWith(hash);
      assert(Locations['getParts_']).to.haveBeenCalledWith(matcher);
    });

    it('should return null if the matcher does not match the hash', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(Locations, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return ['hello', '+'];
        }
      });

      assert(Locations.getMatches(hash, matcher)).to.equal(null);
    });

    it('should return the matches for exact match', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(Locations, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return ['hello', '_', 'location'];
        }
      });

      assert(Locations.getMatches(hash, `${matcher}$`)).to.equal({
        'a': 'hello',
        'b': 'location',
      });
      assert(Locations['getParts_']).to.haveBeenCalledWith(hash);
      assert(Locations['getParts_']).to.haveBeenCalledWith(matcher);
    });

    it('should return null for exact match if the number of parts are not the same', () => {
      let matcher = 'matcher';
      let hash = 'hash';
      spyOn(Locations, 'getParts_').and.callFake((path: string): string[] | void => {
        switch (path) {
          case matcher:
            return [':a', '_', ':b'];
          case hash:
            return [':a', '_'];
        }
      });

      assert(Locations.getMatches(hash, `${matcher}$`)).to.beNull();
      assert(Locations['getParts_']).to.haveBeenCalledWith(hash);
      assert(Locations['getParts_']).to.haveBeenCalledWith(matcher);
    });

  });

  describe('normalizePath', () => {
    it('should add missing `/` at the start of the path', () => {
      assert(Locations.normalizePath('path')).to.equal('/path');
    });

    it('should remove extra `/` at the end of the path', () => {
      assert(Locations.normalizePath('/path/')).to.equal('/path');
    });
  });
});
