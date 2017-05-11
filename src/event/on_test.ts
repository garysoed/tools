import { assert, TestBase } from '../test-base';
TestBase.setup();

import { on, ON_ANNOTATIONS } from '../event/on';
import { Mocks } from '../mock/mocks';


describe('event.on', () => {
  it('should add the add the value correctly', () => {
    const bus = Mocks.object('bus');
    const type = 'type';
    const useCapture = true;

    const constructor = Mocks.object('constructor');
    const target = Mocks.object('target');
    target.constructor = constructor;

    const propertyKey = 'propertyKey';
    const descriptor = Mocks.object('descriptor');

    const mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
    spyOn(ON_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);
    assert(on(bus, type, useCapture)(target, propertyKey, descriptor)).to.equal(descriptor);
    assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
        propertyKey,
        {bus, type, useCapture});
    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
  });
});
