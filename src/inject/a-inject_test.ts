import { assert, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { fake, spy } from 'gs-testing/export/spy';
import { inject } from './a-inject';
import { InjectMetadata } from './inject-metadata';
import { InjectUtil } from './inject-util';

class TestClass {}


describe('inject.Inject', () => {
  should('register the parameter correctly', () => {
    const name = 'name';
    const index = 12;
    const fakeMetadata = new Map<number, InjectMetadata>();
    const injectMetadata = mocks.object<InjectMetadata>('injectMetadata');
    const isOptional = true;

    const getMetadataMapSpy = spy(InjectUtil, 'getMetadataMap');
    fake(getMetadataMapSpy).always().return(fakeMetadata);

    const newInstanceSpy = spy(InjectMetadata, 'newInstance');
    fake(newInstanceSpy).always().return(injectMetadata);

    inject(name, isOptional)(TestClass, 'propertyName', index);

    assert(fakeMetadata).to.haveElements([[index, injectMetadata]]);
    assert(newInstanceSpy).to.haveBeenCalledWith(name, isOptional);
  });

  should('use the parameter name if not specified', () => {
    const propertyName = 'propertyName';
    const index = 12;
    const fakeMetadata = new Map<number, InjectMetadata>();
    const injectMetadata = mocks.object<InjectMetadata>('injectMetadata');

    const getMetadataMapSpy = spy(InjectUtil, 'getMetadataMap');
    fake(getMetadataMapSpy).always().return(fakeMetadata);

    const newInstanceSpy = spy(InjectMetadata, 'newInstance');
    fake(newInstanceSpy).always().return(injectMetadata);

    inject()(TestClass, propertyName, index);

    assert(fakeMetadata).to.haveElements([[index, injectMetadata]]);
    assert(newInstanceSpy).to.haveBeenCalledWith(propertyName, undefined);
  });

  should('throw error if the target is not a constructor', () => {
    assert(() => {
      inject()(mocks.object('target'), 'propertyName', 12);
    }).to.throwErrorWithMessage(/is not a constructor/);
  });
});
