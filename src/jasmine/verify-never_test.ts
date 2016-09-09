import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {verifyNever} from './verify-never';
import {VerifyUtil} from './verify-util';


describe('jasmine.verifyNever', () => {
  it('should return the call the util correctly', () => {
    let instance = Mocks.object('instance');
    let result = Mocks.object('result');

    spyOn(VerifyUtil, 'create').and.returnValue(result);
    expect(verifyNever(instance)).toEqual(result);
    expect(VerifyUtil.create).toHaveBeenCalledWith(instance, true);
  });
});
