import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { Graph, instanceId, nodeOut } from '../graph';
import { ANNOTATIONS } from '../graph/node-in';

describe('graph.nodeOut', () => {
  it(`should register the provider correctly`, () => {
    class TestClass {
      method(a: number, b: number): number {
        return a + b;
      }
    }

    const $ = instanceId('root', NumberType);
    const $a = instanceId('a', NumberType);
    const $b = instanceId('b', NumberType);

    const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
    mockAnnotations.getAttachedValues.and.returnValue(new Map([
      ['method', [{index: 0, instanceId: $a}, {index: 1, instanceId: $b}]],
    ]));
    spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

    spyOn(Graph, 'registerGenericProvider_');

    nodeOut($)(TestClass.prototype, 'method', Mocks.object('descriptor'));
    assert(Graph.registerGenericProvider_).to.haveBeenCalledWith(
        $,
        TestClass.prototype.method,
        $a,
        $b);
    assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
  });
});
