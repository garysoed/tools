import { assert, should } from '@gs-testing';
import { createSpyInstance, fake, SpyObj } from '@gs-testing';
import { RandomizerImpl } from './randomizer';
import { SimpleIdGenerator } from './simple-id-generator';


describe('random.SimpleIdGenerator', () => {
  let generator: SimpleIdGenerator;
  let mockRandom: SpyObj<RandomizerImpl>;

  beforeEach(() => {
    mockRandom = createSpyInstance(RandomizerImpl);
    generator = new SimpleIdGenerator(mockRandom);
  });

  describe('generate', () => {
    should(`generate the ID correctly`, () => {
      fake(mockRandom.shortId).always().return('id');

      assert(generator.generate(['id', 'id-id', 'id-id-id'])).to.equal('id-id-id-id');
    });
  });
});
