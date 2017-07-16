import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { ANNOTATIONS, field } from '../datamodel/field';

describe('datamodel.field', () => {
  it(`should add the correct configuration`, () => {
    const fieldName = 'fieldName';
    const serializedFieldName = 'serializedFieldName';
    const eqFn = Mocks.object('eqFn');
    const ctor = Mocks.object('ctor');
    const target = Mocks.object('target');
    target.constructor = ctor;

    const propertyKey = 'propertyKey';
    const mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
    spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

    field(fieldName, serializedFieldName, eqFn)(target, propertyKey);
    assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
        propertyKey,
        {
          eqFn,
          fieldName: 'FieldName',
          serializedFieldName,
        });
    assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
  });
});
