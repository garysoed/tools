import { assert, should, test } from '@gs-testing/main';
import { createSpyObject, fake, SpyObj } from '@gs-testing/spy';
import { RandomizerImpl } from './randomizer';
import { Rng } from './rng';


test('random.Randomizer', () => {
  let mockRng: SpyObj<Rng>;
  let randomizer: RandomizerImpl;

  beforeEach(() => {
    mockRng = createSpyObject('Rng', ['next']);
    randomizer = new RandomizerImpl(mockRng);
  });

  test('intRange', () => {
    should('return the correct integer from the range', () => {
      fake(mockRng.next).always().return(0.4);
      assert(randomizer.intRange(0, 10)).to.equal(4);
    });
  });

  test('list', () => {
    should('return the correct member of the list', () => {
      fake(mockRng.next).always().return(0.6);
      assert(randomizer.list(['a', 'b', 'c', 'd', 'e'])).to.equal('d');
    });
  });

  test('shortId', () => {
    should('generate the correct ID', () => {
      fake(mockRng.next).always().returnValues(0 / 62, 10 / 62, 11 / 62, 12 / 62, 36 / 62);
      assert(randomizer.shortId()).to.equal('0ABCa');
    });
  });
});
