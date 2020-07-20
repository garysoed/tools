import { assert, should, test } from 'gs-testing';

import { GLOBALS, hash, HASHED_OBJECTS, HASHED_VALUES } from './hash';


test('util.hash', init => {
  init(() => {
    GLOBALS.lastHash = 0;
    HASHED_VALUES.clear();

    return {};
  });

  should('return the correct hash for objects ', () => {
    const nextValue = 123;
    GLOBALS.lastHash = nextValue;
    const object = {id: 'object'};
    assert(hash(object)).to.equal(`${nextValue}`);
    assert(HASHED_OBJECTS.get(object)).to.equal(nextValue);
    assert(GLOBALS.lastHash).to.equal(nextValue + 1);
  });

  should('reuse hash value if the object already exists', () => {
    const hashValue = 123;
    const object = {id: 'object'};
    HASHED_OBJECTS.set(object, hashValue);
    assert(hash(object)).to.equal(`${hashValue}`);
    assert(HASHED_OBJECTS.get(object)).to.equal(hashValue);
  });

  should('return the correct hash', () => {
    const nextValue = 123;
    GLOBALS.lastHash = nextValue;
    const key = 123;
    assert(hash(key)).to.equal(`${nextValue}`);
    assert(HASHED_VALUES).to.haveExactElements(new Map([[key, nextValue]]));
    assert(GLOBALS.lastHash).to.equal(nextValue + 1);
  });

  should('reuse hash value if it already exists', () => {
    const hashValue = 123;
    const key = 123;
    HASHED_VALUES.set(key, hashValue);
    assert(hash(key)).to.equal(`${hashValue}`);
    assert(HASHED_VALUES).to.haveExactElements(new Map([[key, hashValue]]));
  });
});
