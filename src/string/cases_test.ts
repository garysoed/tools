import {TestBase} from '../test-base';
TestBase.setup();

import {Cases} from './cases';


describe('string.Cases', () => {
  describe('toCamelCase', () => {
    it('should format to camelCase correctly', () => {
      let cases = new Cases(['camel', 'case']);
      expect(cases.toCamelCase()).toEqual('camelCase');
    });
  });

  describe('toLowerCase', () => {
    it('should format as lower-case correctly', () => {
      let cases = new Cases(['lower', 'case']);
      expect(cases.toLowerCase()).toEqual('lower-case');
    });
  });

  describe('toPascalCase', () => {
    it('should format as PascalCase correctly', () => {
      let cases = new Cases(['pascal', 'case']);
      expect(cases.toPascalCase()).toEqual('PascalCase');
    });
  });

  describe('toUpperCase', () => {
    it('should format as UPPER_CASE correctly', () => {
      let cases = new Cases(['upper', 'case']);
      expect(cases.toUpperCase()).toEqual('UPPER_CASE');
    });
  });

  describe('of', () => {
    it('should parse camelCase correctly', () => {
      expect(Cases.of('camelCase')['words_']).toEqual(['camel', 'case']);
    });

    it('should parse PascalCase correctly', () => {
      expect(Cases.of('PascalCase')['words_']).toEqual(['pascal', 'case']);
    });

    it('should parse lower-case correctly', () => {
      expect(Cases.of('lower-case')['words_']).toEqual(['lower', 'case']);
    });

    it('should parse UPPER_CASE correctly', () => {
      expect(Cases.of('UPPER_CASE')['words_']).toEqual(['upper', 'case']);
    });

    it('should throw error if the format is unsupported', () => {
      expect(() => {
        Cases.of('unsupported Case');
      }).toThrowError(/unsupported case/);
    });
  });
});
