import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { RandomizerImpl } from './randomizer';
import { SimpleIdGenerator } from './simple-id-generator';


describe('random.SimpleIdGenerator', () => {
  let generator: SimpleIdGenerator;
  let mockRandom: jasmine.SpyObj<RandomizerImpl>;

  beforeEach(() => {
    mockRandom = createSpyObject('Random', ['shortId']);
    generator = new SimpleIdGenerator();
  });

  describe('generate', () => {
    should(`generate the ID correctly`, () => {
      mockRandom.shortId.and.returnValue('id');

      assert(generator.generate(['id', 'id-id', 'id-id-id'])).to.be('id-id-id-id');
    });
  });
});
