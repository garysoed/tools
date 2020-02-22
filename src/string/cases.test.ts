import { assert, should } from 'gs-testing';

import { Cases } from './cases';


describe('string.Cases', () => {
  describe('toCamelCase', () => {
    should('format to camelCase correctly', () => {
      const cases = new Cases(['camel', 'case']);
      assert(cases.toCamelCase()).to.equal('camelCase');
    });
  });

  describe('toLowerCase', () => {
    should('format as lower-case correctly', () => {
      const cases = new Cases(['lower', 'case']);
      assert(cases.toLowerCase()).to.equal('lower-case');
    });
  });

  describe('toPascalCase', () => {
    should('format as PascalCase correctly', () => {
      const cases = new Cases(['pascal', 'case']);
      assert(cases.toPascalCase()).to.equal('PascalCase');
    });
  });

  describe('toUpperCase', () => {
    should('format as UPPER_CASE correctly', () => {
      const cases = new Cases(['upper', 'case']);
      assert(cases.toUpperCase()).to.equal('UPPER_CASE');
    });
  });

  describe('of', () => {
    should('parse camelCase correctly', () => {
      assert(Cases.of('camelCase').toLowerCase()).to.equal('camel-case');
    });

    should('parse PascalCase correctly', () => {
      assert(Cases.of('PascalCase').toLowerCase()).to.equal('pascal-case');
    });

    should('parse lower-case correctly', () => {
      assert(Cases.of('lower-case').toLowerCase()).to.equal('lower-case');
    });

    should('parse UPPER_CASE correctly', () => {
      assert(Cases.of('UPPER_CASE').toLowerCase()).to.equal('upper-case');
    });

    should('parse unknown format correctly', () => {
      assert(Cases.of('Unknown format').toLowerCase()).to.equal('unknown-format');
    });
  });
});
