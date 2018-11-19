import { assert, Mocks, TestBase } from 'gs-testing/export/main';


import { ANNOTATIONS, field } from '../datamodel/field';

describe('datamodel.field', () => {
  should(`add the correct configuration`, () => {
    const fieldName = 'fieldName';
    const serializedFieldName = 'serializedFieldName';
    const eqFn = mocks.object('eqFn');
    const ctor = mocks.object('ctor');
    const target = mocks.object('target');
    const parser = mocks.object('parser');
    target.constructor = ctor;

    const propertyKey = 'propertyKey';
    const mockAnnotations = createSpyObject('Annotations', ['attachValueToProperty']);
    spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

    field(fieldName, parser, serializedFieldName, eqFn)(target, propertyKey);
    assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
        propertyKey,
        {
          eqFn,
          fieldName: 'FieldName',
          parser,
          serializedFieldName,
        });
    assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
  });
});
