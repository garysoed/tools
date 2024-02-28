import {assert, test, should} from 'gs-testing';

import {convertCaseAtomFrom, convertCaseFrom} from './cases';

test('string.Cases', () => {
  test('toCamelCase', () => {
    should('format to camelCase correctly', () => {
      assert(convertCaseFrom('camel case').toCamelCase()).to.equal('camelCase');
    });
  });

  test('toLowerCase', () => {
    should('format as lower-case correctly', () => {
      assert(convertCaseFrom('lower case').toLowerCase()).to.equal(
        'lower-case',
      );
    });
  });

  test('toPascalCase', () => {
    should('format as PascalCase correctly', () => {
      assert(convertCaseFrom('pascal case').toPascalCase()).to.equal(
        'PascalCase',
      );
    });
  });

  test('toUpperCase', () => {
    should('format as UPPER_CASE correctly', () => {
      assert(convertCaseFrom('upper case').toUpperCase()).to.equal(
        'UPPER_CASE',
      );
    });
  });

  test('convertCaseFrom', () => {
    should('parse camelCase correctly', () => {
      assert(convertCaseFrom('camelCase').toLowerCase()).to.equal('camel-case');
    });

    should('parse PascalCase correctly', () => {
      assert(convertCaseFrom('PascalCase').toLowerCase()).to.equal(
        'pascal-case',
      );
    });

    should('parse lower-case correctly', () => {
      assert(convertCaseFrom('lower-case').toLowerCase()).to.equal(
        'lower-case',
      );
    });

    should('parse UPPER_CASE correctly', () => {
      assert(convertCaseFrom('UPPER_CASE').toLowerCase()).to.equal(
        'upper-case',
      );
    });

    should('parse unknown format correctly', () => {
      assert(convertCaseFrom('Unknown format').toLowerCase()).to.equal(
        'unknown-format',
      );
    });
  });

  test('convertCaseAtomFrom', () => {
    should('treat the entire string as one atomic', () => {
      assert(convertCaseAtomFrom('lower case').toPascalCase()).to.equal(
        'Lower case',
      );
    });
  });
});
