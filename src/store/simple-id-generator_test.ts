import {assert, TestBase} from '../test-base';
TestBase.setup();

import {SimpleIdGenerator} from './simple-id-generator';


describe('store.SimpleIdGenerator', () => {
  let generator: SimpleIdGenerator;

  beforeEach(() => {
    generator = new SimpleIdGenerator();
  });

  describe('generate', () => {
    it('should generate an ID correctly', () => {
      let id = 'id';
      spyOn(generator['random_'], 'shortId').and.returnValue(id);
      assert(generator.generate()).to.equal(id);
    });
  });

  describe('resolveConflict', () => {
    it('should resolve the conflicting ID correctly', () => {
      let conflictingId = 'conflictingId';
      let newId = 'newId';

      spyOn(generator['random_'], 'shortId').and.returnValue(newId);

      assert(generator.resolveConflict(conflictingId)).to.equal(`${conflictingId}-${newId}`);
    });
  });
});
