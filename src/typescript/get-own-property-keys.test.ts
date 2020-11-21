import {assert, should, test} from 'gs-testing';

import {getOwnPropertyKeys} from './get-own-property-keys';


test('@tools/typescript/get-own-property-keys', () => {
  should('return the correct keys', () => {
    const child = {
      __proto__: {
        parent: 'parent',
      },
      child: 'child',
    };
    assert(getOwnPropertyKeys(child)).to.haveExactElements(['child']);
  });
});
