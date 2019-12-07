import { assert, createSpyObject, fake, should, SpyObj, test } from '@gs-testing';

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
      fake(mockRng.next).always().return({value: 0.4, done: true});
      assert(randomizer.intRange(0, 10)).to.equal(4);
    });
  });

  test('list', () => {
    should('return the correct member of the list', () => {
      fake(mockRng.next).always().return({value: 0.6, done: true});
      assert(randomizer.list(['a', 'b', 'c', 'd', 'e'])).to.equal('d');
    });
  });

  test('shortId', () => {
    should('generate the correct ID', () => {
      fake(mockRng.next).always().returnValues(
          {value: 0 / 62, done: false},
          {value: 10 / 62, done: false},
          {value: 11 / 62, done: false},
          {value: 12 / 62, done: false},
          {value: 36 / 62, done: false},
          {value: 37 / 62, done: false},
          {value: 38 / 62, done: false},
      );
      assert(randomizer.shortId()).to.equal('0ABCabc');
    });
  });
});
