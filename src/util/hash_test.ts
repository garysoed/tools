import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { GLOBALS, hash, HASHED_OBJECTS, HASHED_VALUES } from '../util/hash';


describe('util.hash', () => {
  beforeEach(() => {
    GLOBALS.lastHash = 0;
    HASHED_VALUES.clear();
  });

  it('should return the correct hash for objects ', () => {
    const nextValue = 123;
    GLOBALS.lastHash = nextValue;
    const object = Mocks.object('object');
    assert(hash(object)).to.equal(`${nextValue}`);
    assert(HASHED_OBJECTS.get(object)).to.equal(nextValue);
    assert(GLOBALS.lastHash).to.equal(nextValue + 1);
  });

  it('should reuse hash value if the object already exists', () => {
    const hashValue = 123;
    const object = Mocks.object('object');
    HASHED_OBJECTS.set(object, hashValue);
    assert(hash(object)).to.equal(`${hashValue}`);
    assert(HASHED_OBJECTS.get(object)).to.equal(hashValue);
  });

  it('should return the correct hash', () => {
    const nextValue = 123;
    GLOBALS.lastHash = nextValue;
    const key = 123;
    assert(hash(key)).to.equal(`${nextValue}`);
    assert(HASHED_VALUES).to.haveEntries([[key, nextValue]]);
    assert(GLOBALS.lastHash).to.equal(nextValue + 1);
  });

  it('should reuse hash value if it already exists', () => {
    const hashValue = 123;
    const key = 123;
    HASHED_VALUES.set(key, hashValue);
    assert(hash(key)).to.equal(`${hashValue}`);
    assert(HASHED_VALUES).to.haveEntries([[key, hashValue]]);
  });
});
