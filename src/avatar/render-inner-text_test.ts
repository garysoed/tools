import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { Avatar } from '../avatar';
import { renderInnerText } from '../avatar/render-inner-text';
import { BaseDisposable } from '../dispose';
import { ANNOTATIONS } from '../graph/node-in';
import { ImmutableMap, ImmutableSet } from '../immutable';

describe('avatar.renderInnerText', () => {
  it(`should define the renderer correctly`, () => {
    class TestClass extends BaseDisposable { }

    const selector = Mocks.object('selector');
    const propertyKey = 'propertyKey';

    spyOn(Avatar, 'defineRenderer');

    const param1 = Mocks.object('param1');
    const param2 = Mocks.object('param2');
    const map = ImmutableMap.of([[propertyKey, ImmutableSet.of([{id: param1}, {id: param2}])]]);
    const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
    mockAnnotations.getAttachedValues.and.returnValue(map);

    spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

    renderInnerText(selector)(TestClass.prototype, propertyKey, {});
    assert(Avatar.defineRenderer).to.haveBeenCalledWith(
        TestClass,
        propertyKey,
        selector,
        param1,
        param2);
    assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
  });

  it(`should throw error if the target is not an instance of BaseDisposable`, () => {
    class TestClass { }

    const selector = Mocks.object('selector');
    const propertyKey = 'propertyKey';

    assert(() => {
      renderInnerText(selector)(TestClass.prototype, propertyKey, {});
    }).to.throwError(/instance of BaseDisposable/);
  });
});
