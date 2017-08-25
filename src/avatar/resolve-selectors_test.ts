import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { resolveSelectors } from '../avatar';
import { SelectorStub } from '../avatar/selector';

describe('avatar.resolveSelectors', () => {
  it(`should resolve all SelectorStubs`, () => {
    const impl1 = Mocks.object('impl1');
    const impl2 = Mocks.object('impl2');
    const impl3 = Mocks.object('impl3');
    const impl4 = Mocks.object('impl4');

    const mockStub1 = jasmine.createSpyObj('Stub1', ['resolve']);
    mockStub1.resolve.and.returnValue(impl1);
    Object.setPrototypeOf(mockStub1, SelectorStub.prototype);

    const mockStub3 = jasmine.createSpyObj('Stub3', ['resolve']);
    mockStub3.resolve.and.returnValue(impl3);
    Object.setPrototypeOf(mockStub3, SelectorStub.prototype);

    const object = Mocks.object('object');

    const value = 123;
    const mockObject = jasmine.createSpyObj('Object', ['getValue']);
    mockObject.getValue.and.returnValue(value);

    const input = {
      a: 1,
      b: {
        a: mockStub1,
        b: impl2,
        c: 'a',
      },
      c: mockStub3,
      d: impl4,
      e: object,
      f: mockObject,
    };

    const output = resolveSelectors(input);
    assert(output).to.equal({
      a: 1,
      b: {
        a: impl1,
        b: impl2,
        c: 'a',
      },
      c: impl3,
      d: impl4,
      e: object,
      f: mockObject,
    });
    assert(mockStub1.resolve).to.haveBeenCalledWith(input);
    assert(mockStub3.resolve).to.haveBeenCalledWith(input);
    assert(output.f.getValue()).to.equal(value);
  });
});
