import {assert, should, test} from 'gs-testing';

import {XlateService} from './xlate-service';

test('@tools/src/i18n/xlate-service', () => {
  test('simple', () => {
    should('translate strings with substitutions correctly', () => {
      const xlate = new XlateService({
        data: [
          {key: 'Call {{name}} at {{phone}}', translation: 'At {{phone}}, call {{name}}'},
        ],
      });

      const registration = {
        plain: 'Call {{name}} at {{phone}}',
      };
      assert(xlate.simple(registration)({'name': 'Tom Hygge', 'phone': '(123) 456-7890'})).to
          .equal('At (123) 456-7890, call Tom Hygge');
    });

    should('translate strings with no substitutions correctly', () => {
      const xlate = new XlateService({
        data: [
          {key: 'Hello i18n', translation: 'Hello internationalization!'},
        ],
      });

      const registration = {
        plain: 'Hello i18n',
      };
      assert(xlate.simple(registration)()).to.equal('Hello internationalization!');
    });

    should('use original text for untranslated strings', () => {
      const xlate = new XlateService({data: []});

      const registration = {
        plain: 'Call {{name}} at {{phone}}',
      };
      assert(xlate.simple(registration)({'name': 'Tom Hygge', 'phone': '(123) 456-7890'})).to
          .equal('Call Tom Hygge at (123) 456-7890');
    });
  });
});