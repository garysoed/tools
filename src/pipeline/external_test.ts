import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { ArgMetaData } from './arg-meta-data';
import { External } from './external';
import { PipeUtil } from './pipe-util';


describe('pipeline.External', () => {
  it('should return decorator that adds the correct argument', () => {
    let argMetaData = Mocks.object('ArgMetaData');
    let key = 'key';
    let target = Mocks.object('target');
    let propertyKey = 'propertyKey';
    let parameterIndex = 123;

    spyOn(PipeUtil, 'addArgument');
    spyOn(ArgMetaData, 'newInstance').and.returnValue(argMetaData);

    let decorator = External(key);
    decorator(target, propertyKey, parameterIndex);

    assert(PipeUtil.addArgument).to
        .haveBeenCalledWith(target, propertyKey, parameterIndex, argMetaData);
    assert(ArgMetaData.newInstance).to.haveBeenCalledWith(key, {}, true);
  });
});
