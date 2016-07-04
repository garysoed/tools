import TestBase from '../test-base';
TestBase.setup();

import {ArgMetaData} from './arg-meta-data';
import {Internal} from './internal';
import {Mocks} from '../mock/mocks';
import {PipeUtil} from './pipe-util';


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

    expect(PipeUtil.addArgument).toHaveBeenCalledWith(
        target,
        propertyKey,
        parameterIndex,
        argMetaData);
    expect(ArgMetaData.newInstance).toHaveBeenCalledWith(key, forwardedArguments, false);
  });
});
