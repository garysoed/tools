import { assert, TestBase } from '../test-base';
TestBase.setup();

import { gentest } from '../testgen/gentest';
import { TestSpec } from '../testgen/test-spec';

describe('testgen.gentest', () => {
  it(`should call the handler for every combination of the specs`, () => {
    const mockHandler = jasmine.createSpy('Handler');
    gentest(
        {a: TestSpec.of([1, 2, 3]), b: TestSpec.of(['a', 'b']), c: TestSpec.of([null])},
        mockHandler);
    assert(mockHandler).to.haveBeenCalledWith({a: 1, b: 'a', c: null});
    assert(mockHandler).to.haveBeenCalledWith({a: 1, b: 'b', c: null});
    assert(mockHandler).to.haveBeenCalledWith({a: 2, b: 'a', c: null});
    assert(mockHandler).to.haveBeenCalledWith({a: 2, b: 'b', c: null});
    assert(mockHandler).to.haveBeenCalledWith({a: 3, b: 'a', c: null});
    assert(mockHandler).to.haveBeenCalledWith({a: 3, b: 'b', c: null});
  });
});
