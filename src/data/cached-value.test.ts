import {assert, createSpy, fake, resetCalls, should, test} from 'gs-testing';

import {CachedValue} from './cached-value';

test('data.cached-value', () => {
  should('cache the getter', () => {
    const spy = createSpy<number, []>('spyGetter');
    const cachedValue = new CachedValue(spy);
    const value = 123;
    fake(spy).always().return(value);

    assert(cachedValue.value).to.equal(value);

    resetCalls(spy);
    assert(cachedValue.value).to.equal(value);
    assert(spy).toNot.haveBeenCalled();
  });
});
