import {TestBase} from '../test-base';
TestBase.setup();

import {ArgMetaData} from './arg-meta-data';
import {External} from './external';
import {Mocks} from '../mock/mocks';
import {PipeUtil} from './pipe-util';


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

    expect(PipeUtil.addArgument).toHaveBeenCalledWith(
        target,
        propertyKey,
        parameterIndex,
        argMetaData);
    expect(ArgMetaData.newInstance).toHaveBeenCalledWith(key, {}, true);
  });
});
