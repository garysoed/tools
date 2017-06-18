import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Bus } from '../event/bus';
import { on, ON_ANNOTATIONS } from '../event/on';
import { Mocks } from '../mock/mocks';


describe('event.on', () => {
  it('should add the add the value correctly', () => {
    const bus = Mocks.object('bus');
    Object.setPrototypeOf(bus, Bus.prototype);
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
        {busProvider: Matchers.any(Function), type, useCapture});
    assert(mockAnnotations.attachValueToProperty.calls.argsFor(0)[1].busProvider()).to.equal(bus);
    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
  });

  it(`should handle bus providers correctly`, () => {
    const busProvider = Mocks.object('busProvider');
    const type = 'type';
    const useCapture = true;

    const constructor = Mocks.object('constructor');
    const target = Mocks.object('target');
    target.constructor = constructor;

    const propertyKey = 'propertyKey';
    const descriptor = Mocks.object('descriptor');

    const mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
    spyOn(ON_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);
    assert(on(busProvider, type, useCapture)(target, propertyKey, descriptor)).to.equal(descriptor);
    assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
        propertyKey,
        {busProvider, type, useCapture});
    assert(ON_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
  });
});
