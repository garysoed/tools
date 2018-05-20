import { assert, TestBase } from '../test-base';
TestBase.setup();

import { RandomizerImpl } from './randomizer';
import { SimpleIdGenerator } from './simple-id-generator';


describe('random.SimpleIdGenerator', () => {
  let generator: SimpleIdGenerator;
  let mockRandom: jasmine.SpyObj<RandomizerImpl>;

  beforeEach(() => {
    mockRandom = jasmine.createSpyObj('Random', ['shortId']);
    generator = new SimpleIdGenerator();
  });

  describe('generate', () => {
    it(`should generate the ID correctly`, () => {
      mockRandom.shortId.and.returnValue('id');

      assert(generator.generate(['id', 'id-id', 'id-id-id'])).to.be('id-id-id-id');
    });
  });
});
