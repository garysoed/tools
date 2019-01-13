import { assert, should } from 'gs-testing/export/main';

import { ImmutableList } from '../collect/immutable-list';
import { Cases } from './cases';


describe('string.Cases', () => {
  describe('toCamelCase', () => {
    should('format to camelCase correctly', () => {
      const cases = new Cases(ImmutableList.of(['camel', 'case']));
      assert(cases.toCamelCase()).to.equal('camelCase');
    });
  });

  describe('toLowerCase', () => {
    should('format as lower-case correctly', () => {
      const cases = new Cases(ImmutableList.of(['lower', 'case']));
      assert(cases.toLowerCase()).to.equal('lower-case');
    });
  });

  describe('toPascalCase', () => {
    should('format as PascalCase correctly', () => {
      const cases = new Cases(ImmutableList.of(['pascal', 'case']));
      assert(cases.toPascalCase()).to.equal('PascalCase');
    });
  });

  describe('toUpperCase', () => {
    should('format as UPPER_CASE correctly', () => {
      const cases = new Cases(ImmutableList.of(['upper', 'case']));
      assert(cases.toUpperCase()).to.equal('UPPER_CASE');
    });
  });

  describe('of', () => {
    should('parse camelCase correctly', () => {
      assert(Cases.of('camelCase')['words']).to.haveElements(['camel', 'case']);
    });

    should('parse PascalCase correctly', () => {
      assert(Cases.of('PascalCase')['words']).to.haveElements(['pascal', 'case']);
    });

    should('parse lower-case correctly', () => {
      assert(Cases.of('lower-case')['words']).to.haveElements(['lower', 'case']);
    });

    should('parse UPPER_CASE correctly', () => {
      assert(Cases.of('UPPER_CASE')['words']).to.haveElements(['upper', 'case']);
    });

    should('parse unknown format correctly', () => {
      assert(Cases.of('Unknown format')['words']).to.haveElements(['unknown', 'format']);
    });
  });
});
