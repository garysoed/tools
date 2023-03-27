import {assert, setup, should, test} from 'gs-testing';

import {XtractService} from './xtract-service';

test('@tools/src/i18n/xtract-service', () => {
  const _ = setup(() => {
    const service = new XtractService();
    return {service};
  });

  test('simple', () => {
    should('generate add the registration correctly', () => {
      const registration = {
        plain: 'Call {{name}} at {{phone}}',
      };
      assert(_.service.simple(registration)()).to.equal('[RAW] Call {{name}} at {{phone}}');
      assert(_.service.registrations).to.equal(
          new Map([['Call {{name}} at {{phone}}', registration]]),
      );
    });
  });
});