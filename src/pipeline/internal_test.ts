import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { ArgMetaData } from './arg-meta-data';
import { Internal } from './internal';
import { PipeUtil } from './pipe-util';


describe('pipeline.Internal', () => {
  it('should return a decorator that adds the argument metadata correctly', () => {
    let key = 'key';
    let forwardedArguments = Mocks.object('forwardedArguments');
    let target = Mocks.object('target');
    let propertyKey = 'propertyKey';
    let parameterIndex = 123;

    let argMetaData = Mocks.object('argMetaData');
    spyOn(ArgMetaData, 'newInstance').and.returnValue(argMetaData);

    spyOn(PipeUtil, 'addArgument');

    Internal(key, forwardedArguments)(target, propertyKey, parameterIndex);

    assert(PipeUtil.addArgument).to
        .haveBeenCalledWith(target, propertyKey, parameterIndex, argMetaData);
    assert(ArgMetaData.newInstance).to.haveBeenCalledWith(key, forwardedArguments, false);
  });
});
