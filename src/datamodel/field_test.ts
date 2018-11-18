import { assert, Mocks, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { ANNOTATIONS, field } from '../datamodel/field';

describe('datamodel.field', () => {
  should(`add the correct configuration`, () => {
    const fieldName = 'fieldName';
    const serializedFieldName = 'serializedFieldName';
    const eqFn = Mocks.object('eqFn');
    const ctor = Mocks.object('ctor');
    const target = Mocks.object('target');
    const parser = Mocks.object('parser');
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
