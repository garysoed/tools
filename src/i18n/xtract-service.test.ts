import {assert, setup, should, test} from 'gs-testing';

import {XtractService} from './xtract-service';

test('@tools/src/i18n/xtract-service', () => {
  const _ = setup(() => {
    const service = new XtractService();
    return {service};
  });

  test('simple', () => {
    should('generate correct key string', () => {
      assert(_.service.simple('name', 'phone')`Call ${'Tom Hygge'} at ${'(123) 456-7890'}`)
          .to.equal('Call Tom Hygge at (123) 456-7890');
      assert(_.service.keys).to.equal(new Set([
        'Call ${name} at ${phone}',
      ]));
    });

    should('support missing arg names', () => {
      assert(_.service.simple()`Call ${'Tom Hygge'} at ${'(123) 456-7890'}`)
          .to.equal('Call Tom Hygge at (123) 456-7890');
      assert(_.service.keys).to.equal(new Set([
        'Call ${0} at ${1}',
      ]));
    });

    should('support strings with no substitutions', () => {
      assert(_.service.simple()`Call Tom Hygge at (123) 456-7890`)
          .to.equal('Call Tom Hygge at (123) 456-7890');
      assert(_.service.keys).to.equal(new Set([
        'Call Tom Hygge at (123) 456-7890',
      ]));
    });
  });
});