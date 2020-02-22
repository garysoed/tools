import { assert, should, test } from 'gs-testing';

import { iterableFrom } from './iterable-from';

test('@tools/collect/structures/iterable-from', () => {
  should(`convert node list correctly`, () => {
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    const child3 = document.createElement('div');

    const root = document.createElement('div');
    root.appendChild(child1);
    root.appendChild(child2);
    root.appendChild(child3);

    assert([...iterableFrom(root.childNodes)]).to.haveExactElements([child1, child2, child3]);
  });
});
