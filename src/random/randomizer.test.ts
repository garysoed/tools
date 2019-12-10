import { assert, createSpyObject, fake, should, SpyObj, test } from '@gs-testing';

import { RandomGenerator } from './random-generator';
import { RandomizerImpl } from './randomizer';


test('random.Randomizer', () => {
  let mockRng: SpyObj<RandomGenerator>;
  let randomizer: RandomizerImpl;

  beforeEach(() => {
    mockRng = createSpyObject('Rng', ['next']);
    randomizer = new RandomizerImpl(mockRng);
  });

  test('intRange', () => {
    should('return the correct integer from the range', () => {
      fake(mockRng.next).always().return([0.4, mockRng]);
      assert(randomizer.intRange(0, 10)).to.equal(4);
    });
  });

  test('list', () => {
    should('return the correct member of the list', () => {
      fake(mockRng.next).always().return([0.6, mockRng]);
      assert(randomizer.list(['a', 'b', 'c', 'd', 'e'])).to.equal('d');
    });
  });

  test('shortId', () => {
    should('generate the correct ID', () => {
      fake(mockRng.next).always().returnValues(
          [0 / 62, mockRng],
          [10 / 62, mockRng],
          [11 / 62, mockRng],
          [12 / 62, mockRng],
          [36 / 62, mockRng],
          [37 / 62, mockRng],
          [38 / 62, mockRng],
      );
      assert(randomizer.shortId()).to.equal('0ABCabc');
    });
  });
});
