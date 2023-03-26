import {assert, should, test} from 'gs-testing';

import {XlateService} from './xlate-service';

test('@tools/src/i18n/xlate-service', () => {
  test('simple', () => {
    should('translate strings with substitutions correctly', () => {
      const xlate = new XlateService(new Map([
        ['Call ${name} at ${phone}', 'At ${phone}, call ${name}'],
      ]));

      assert(xlate.simple('name', 'phone')`Call ${'Tom Hygge'} at ${'(123) 456-7890'}`).to
          .equal('At (123) 456-7890, call Tom Hygge');
    });

    should('translate strings with no substitutions correctly', () => {
      const xlate = new XlateService(new Map([
        ['Hello i18n', 'Hello internationalization!'],
      ]));

      assert(xlate.simple()`Hello i18n`).to.equal('Hello internationalization!');
    });

    should('use original text for untranslated strings', () => {
      const xlate = new XlateService(new Map());

      assert(xlate.simple('name', 'phone')`Call ${'Tom Hygge'} at ${'(123) 456-7890'}`).to
          .equal('Call Tom Hygge at (123) 456-7890');
    });
  });
});