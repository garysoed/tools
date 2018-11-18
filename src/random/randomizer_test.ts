import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { RandomizerImpl } from './randomizer';


describe('random.Randomizer', () => {
  let mockRng: any;
  let randomizer: RandomizerImpl;

  beforeEach(() => {
    mockRng = createSpyObject('Rng', ['next']);
    randomizer = new RandomizerImpl(mockRng);
  });

  describe('intRange', () => {
    should('return the correct integer from the range', () => {
      mockRng.next.and.returnValue(0.4);
      assert(randomizer.intRange(0, 10)).to.equal(4);
    });
  });

  describe('list', () => {
    should('return the correct member of the list', () => {
      mockRng.next.and.returnValue(0.6);
      assert(randomizer.list(['a', 'b', 'c', 'd', 'e'])).to.equal('d');
    });
  });

  describe('shortId', () => {
    should('generate the correct ID', () => {
      mockRng.next.and.returnValues(0 / 62, 10 / 62, 11 / 62, 12 / 62, 36 / 62);
      assert(randomizer.shortId()).to.equal('0ABCa');
    });
  });
});
