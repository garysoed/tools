import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {verify} from './verify';
import {VerifyUtil} from './verify-util';


describe('jasmine.verify', () => {
  it('should return the call the util correctly', () => {
    let instance = Mocks.object('instance');
    let result = Mocks.object('result');

    spyOn(VerifyUtil, 'create').and.returnValue(result);
    expect(verify(instance)).toEqual(result);
    expect(VerifyUtil.create).toHaveBeenCalledWith(instance, false);
  });
});
