import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Randomizer} from './randomizer';


describe('random.Randomizer', () => {
  let mockRng;
  let randomizer: Randomizer;

  beforeEach(() => {
    mockRng = jasmine.createSpyObj('Rng', ['next']);
    randomizer = new Randomizer(mockRng);
  });

  describe('intRange', () => {
    it('should return the correct integer from the range', () => {
      mockRng.next.and.returnValue(0.4);
      assert(randomizer.intRange(0, 10)).to.equal(4);
    });
  });

  describe('list', () => {
    it('should return the correct member of the list', () => {
      mockRng.next.and.returnValue(0.6);
      assert(randomizer.list(['a', 'b', 'c', 'd', 'e'])).to.equal('d');
    });
  });

  describe('shortId', () => {
    it('should generate the correct ID', () => {
      mockRng.next.and.returnValues(0 / 62, 10 / 62, 11 / 62, 12 / 62, 36 / 62);
      assert(randomizer.shortId()).to.equal('0ABCa');
    });
  });
});
