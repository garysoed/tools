import {assert, should, test} from 'gs-testing';

import {asExtractionKey} from './extraction';
import {XlateService} from './xlate-service';

test('@tools/src/i18n/xlate-service', () => {
  test('simple', () => {
    should('translate strings with substitutions correctly', () => {
      const xlate = new XlateService({
        data: [
          {
            type: 'simple',
            key: asExtractionKey('Call {{name}} at {{phone}}'),
            translation: 'At {{phone}}, call {{name}}',
          },
        ],
        locale: 'en-US',
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
          {
            type: 'simple',
            key: asExtractionKey('Hello i18n'),
            translation: 'Hello internationalization!',
          },
        ],
        locale: 'en-US',
      });

      const registration = {
        plain: 'Hello i18n',
      };
      assert(xlate.simple(registration)()).to.equal('Hello internationalization!');
    });
  });

  test('plural', () => {
    should('translate strings with the correct plural rule', () => {
      const xlate = new XlateService({
        data: [
          {
            type: 'plural',
            key: asExtractionKey('[PLURAL] Buy {{#}} apples'),
            zero: asExtractionKey('Buy {{#}} apples'),
            one: asExtractionKey('Buy an apple'),
            two: asExtractionKey('Buy {{#}} apples'),
            few: asExtractionKey('Buy {{#}} apples'),
            many: asExtractionKey('Buy {{#}} apples'),
            other: asExtractionKey('Buy {{#}} apples'),
          },
          {
            type: 'simple',
            key: asExtractionKey('Buy an apple'),
            translation: 'An apple, you shall buy',
          },
          {
            type: 'simple',
            key: asExtractionKey('Buy {{#}} apples'),
            translation: '{{#}} apples, you shall buy',
          },
        ],
        locale: 'en-US',
      });

      const registration = {
        one: xlate.simple({plain: 'Buy an apple'}),
        other: xlate.simple({plain: 'Buy {{#}} apples'}),
      };

      const formatter = xlate.plural(registration);
      assert(formatter(1)()).to.equal('An apple, you shall buy');
      assert(formatter(3)({'#': '3'})).to.equal('3 apples, you shall buy');
    });

    should('translate strings with multiple count rules', () => {
      const xlate = new XlateService({
        data: [
          {
            type: 'plural',
            key: asExtractionKey('[PLURAL] [PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
            zero: asExtractionKey('[PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
            one: asExtractionKey('[PLURAL] Buy an apple and {{#banana}} bananas'),
            two: asExtractionKey('[PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
            few: asExtractionKey('[PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
            many: asExtractionKey('[PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
            other: asExtractionKey('[PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
          },
          {
            type: 'plural',
            key: asExtractionKey('[PLURAL] Buy {{#apple}} apples and {{#banana}} bananas'),
            zero: asExtractionKey('Buy {{#apple}} apples and {{#banana}} bananas'),
            one: asExtractionKey('Buy {{#apple}} apples and a banana'),
            two: asExtractionKey('Buy {{#apple}} apples and {{#banana}} bananas'),
            few: asExtractionKey('Buy {{#apple}} apples and {{#banana}} bananas'),
            many: asExtractionKey('Buy {{#apple}} apples and {{#banana}} bananas'),
            other: asExtractionKey('Buy {{#apple}} apples and {{#banana}} bananas'),
          },
          {
            type: 'plural',
            key: asExtractionKey('[PLURAL] Buy an apple and {{#banana}} bananas'),
            zero: asExtractionKey('Buy an apple and {{#banana}} bananas'),
            one: asExtractionKey('Buy an apple and a banana'),
            two: asExtractionKey('Buy an apple and {{#banana}} bananas'),
            few: asExtractionKey('Buy an apple and {{#banana}} bananas'),
            many: asExtractionKey('Buy an apple and {{#banana}} bananas'),
            other: asExtractionKey('Buy an apple and {{#banana}} bananas'),
          },
          {
            type: 'simple',
            key: asExtractionKey('Buy an apple and a banana'),
            translation: 'An apple and a banana, you shall buy',
          },
          {
            type: 'simple',
            key: asExtractionKey('Buy an apple and {{#banana}} bananas'),
            translation: 'An apple and {{#banana}} bananas, you shall buy',
          },
          {
            type: 'simple',
            key: asExtractionKey('Buy {{#apple}} apples and a banana'),
            translation: '{{#apple}} apples and a banana, you shall buy',
          },
          {
            type: 'simple',
            key: asExtractionKey('Buy {{#apple}} apples and {{#banana}} bananas'),
            translation: '{{#apple}} apples and {{#banana}} bananas, you shall buy',
          },
        ],
        locale: 'en-US',
      });

      const registration = {
        one: xlate.plural({
          one: xlate.simple({plain: 'Buy an apple and a banana'}),
          other: xlate.simple({plain: 'Buy an apple and {{#banana}} bananas'}),
        }),
        other: xlate.plural({
          one: xlate.simple({plain: 'Buy {{#apple}} apples and a banana'}),
          other: xlate.simple({plain: 'Buy {{#apple}} apples and {{#banana}} bananas'}),
        }),
      };

      const formatter = xlate.plural(registration);
      assert(formatter(1)(1)()).to.equal('An apple and a banana, you shall buy');
      assert(formatter(1)(3)({'#banana': '3'})).to.equal('An apple and 3 bananas, you shall buy');
      assert(formatter(3)(1)({'#apple': '3'})).to.equal('3 apples and a banana, you shall buy');
      assert(formatter(3)(3)({'#apple': '3', '#banana': '3'})).to
          .equal('3 apples and 3 bananas, you shall buy');
    });
  });
});