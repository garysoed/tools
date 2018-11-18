import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { inject } from './a-inject';
import { InjectMetadata } from './inject-metadata';
import { InjectUtil } from './inject-util';

class TestClass {}


describe('inject.Inject', () => {
  should('register the parameter correctly', () => {
    const name = 'name';
    const index = 12;
    const fakeMetadata = new Map<number, string>();
    const injectMetadata = Mocks.object('injectMetadata');
    const defaultValue = Mocks.object('defaultValue');

    spyOn(InjectUtil, 'getMetadataMap').and.returnValue(fakeMetadata);
    spyOn(InjectMetadata, 'newInstance').and.returnValue(injectMetadata);

    inject(name, defaultValue)(TestClass, 'propertyName', index);

    assert(fakeMetadata).to.haveEntries([[index, injectMetadata]]);
    assert(InjectMetadata.newInstance).to.haveBeenCalledWith(name, defaultValue);
  });

  should('use the parameter name if not specified', () => {
    const propertyName = 'propertyName';
    const index = 12;
    const fakeMetadata = new Map<number, string>();
    const injectMetadata = Mocks.object('injectMetadata');

    spyOn(InjectUtil, 'getMetadataMap').and.returnValue(fakeMetadata);
    spyOn(InjectMetadata, 'newInstance').and.returnValue(injectMetadata);

    inject()(TestClass, propertyName, index);

    assert(fakeMetadata).to.haveEntries([[index, injectMetadata]]);
    assert(InjectMetadata.newInstance).to.haveBeenCalledWith(propertyName, undefined);
  });

  should('throw error if the target is not a constructor', () => {
    assert(() => {
      inject()(Mocks.object('target'), 'propertyName', 12);
    }).to.throwError(/is not a constructor/);
  });
});
