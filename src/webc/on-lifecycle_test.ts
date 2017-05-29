import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { ANNOTATIONS, onLifecycle } from '../webc/on-lifecycle';

class TestClass { }


describe('webc.onLifecycle', () => {
  it('should add the annotation correctly', () => {
    const method = 'method';
    const descriptor = Mocks.object('descriptor');
    onLifecycle('create')(TestClass.prototype, method, descriptor);
    assert(ANNOTATIONS.forCtor(TestClass).getAttachedValues().get(method)!)
        .to.haveElements(['create']);
  });
});
