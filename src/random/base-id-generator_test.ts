import { assert, TestBase } from '../test-base';
TestBase.setup();

import { BaseIdGenerator } from '../random/base-id-generator';


class TestIdGenerator extends BaseIdGenerator {
  protected newId_(): string {
    return '';
  }

  protected resolveConflict_(id: string): string {
    return '';
  }
}


describe('random.BaseIdGenerator', () => {
  let generator: BaseIdGenerator;

  beforeEach(() => {
    generator = new TestIdGenerator();
  });

  describe('generate', () => {
    it('should keep resolving ID conflict until it is different', () => {
      spyOn(generator, 'newId_').and.returnValue('1');
      spyOn(generator, 'resolveConflict_').and.returnValues('2', '3', '4');
      assert(generator.generate(['1', '2', '3'])).to.equal('4');
      assert(generator['resolveConflict_']).to.haveBeenCalledWith('1');
      assert(generator['resolveConflict_']).to.haveBeenCalledWith('2');
      assert(generator['resolveConflict_']).to.haveBeenCalledWith('3');
    });
  });
});
