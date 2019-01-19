import { assert, match, should, test } from 'gs-testing/export/main';
import { getMatches, getParts_, normalizePath } from './locations';


test('ui.Locations', () => {
  test('getParts_', () => {
    should('split the normalized parts', () => {
      const path = '/a/./b/c';

      assert(getParts_(path)()).to.haveElements(['', 'a', 'b', 'c']);
    });
  });

  test('getMatches', () => {
    should('return the correct matches', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getMatches('/hello/_/location', '/:a/_/:b')!()).to.haveElements([
        match.anyTupleThat<[string, string]>().haveExactElements(['a', 'hello']),
        match.anyTupleThat<[string, string]>().haveExactElements(['b', 'location']),
      ]);
    });

    should('return null if the matcher does not match the hash', () => {
      assert(getMatches('/hello/+', '/:a/_/:b')).to.beNull();
    });

    should('return the matches for exact match', () => {
      // tslint:disable-next-line:no-non-null-assertion
      assert(getMatches('/hello/_/location', `/:a/_/:b$`)!()).to.haveElements([
        match.anyTupleThat<[string, string]>().haveExactElements(['a', 'hello']),
        match.anyTupleThat<[string, string]>().haveExactElements(['b', 'location']),
      ]);
    });

    should('return null for exact match if the number of parts are not the same', () => {
      assert(getMatches('/hello/_', `/:a/_/:b$`)).to.beNull();
    });

  });

  test('normalizePath', () => {
    should('add missing `/` at the start of the path', () => {
      assert(normalizePath('path')).to.equal('/path');
    });

    should('remove extra `/` at the end of the path', () => {
      assert(normalizePath('/path/')).to.equal('/path');
    });
  });
});
