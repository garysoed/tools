import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose';
import { ANNOTATIONS } from '../graph/node-in';
import { ImmutableSet } from '../immutable';
import { Persona } from '../persona';
import { createRenderDecorator } from '../persona/render';

describe('persona.createRenderDecorator', () => {
  it(`should create decorator that defines the renderer correctly`, () => {
    const selector = Mocks.object('selector');
    const ctor = Mocks.object('ctor');
    const target = Mocks.object('target');
    Object.setPrototypeOf(target, BaseDisposable.prototype);
    target.constructor = ctor;
    const propertyKey = 'propertyKey';

    spyOn(Persona, 'defineRenderer');

    const param1 = Mocks.object('param1');
    const param2 = Mocks.object('param2');
    const map = new Map([
      [propertyKey, ImmutableSet.of([{id: param2, index: 1}, {id: param1, index: 0}])],
    ]);
    const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
    mockAnnotations.getAttachedValues.and.returnValue(map);
    spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

    createRenderDecorator()(selector)(target, propertyKey, Mocks.object('descriptor'));
    assert(Persona.defineRenderer).to
        .haveBeenCalledWith(ctor, propertyKey, selector, param1, param2);
    assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
  });

  it(`should throw error if the target is not BaseDisposable`, () => {
    const selector = Mocks.object('selector');
    const target = Mocks.object('target');

    assert(() => {
      createRenderDecorator()(selector)(target, 'propertyKey', Mocks.object('descriptor'));
    }).to.throwError(/not an instance of BaseDisposable/);
  });
});
