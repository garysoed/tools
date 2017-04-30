import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Cases } from './cases';


describe('string.Cases', () => {
  describe('toCamelCase', () => {
    it('should format to camelCase correctly', () => {
      const cases = new Cases(['camel', 'case']);
      assert(cases.toCamelCase()).to.equal('camelCase');
    });
  });

  describe('toLowerCase', () => {
    it('should format as lower-case correctly', () => {
      const cases = new Cases(['lower', 'case']);
      assert(cases.toLowerCase()).to.equal('lower-case');
    });
  });

  describe('toPascalCase', () => {
    it('should format as PascalCase correctly', () => {
      const cases = new Cases(['pascal', 'case']);
      assert(cases.toPascalCase()).to.equal('PascalCase');
    });
  });

  describe('toUpperCase', () => {
    it('should format as UPPER_CASE correctly', () => {
      const cases = new Cases(['upper', 'case']);
      assert(cases.toUpperCase()).to.equal('UPPER_CASE');
    });
  });

  describe('of', () => {
    it('should parse camelCase correctly', () => {
      assert(Cases.of('camelCase')['words_']).to.equal(['camel', 'case']);
    });

    it('should parse PascalCase correctly', () => {
      assert(Cases.of('PascalCase')['words_']).to.equal(['pascal', 'case']);
    });

    it('should parse lower-case correctly', () => {
      assert(Cases.of('lower-case')['words_']).to.equal(['lower', 'case']);
    });

    it('should parse UPPER_CASE correctly', () => {
      assert(Cases.of('UPPER_CASE')['words_']).to.equal(['upper', 'case']);
    });

    it('should parse unknown format correctly', () => {
      assert(Cases.of('Unknown format')['words_']).to.equal(['unknown', 'format']);
    });
  });
});
