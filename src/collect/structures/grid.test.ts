import {arrayThat, assert, objectThat, setup, should, test} from 'gs-testing';

import {Grid, gridFrom} from './grid';
import {GridEntry} from './readonly-grid';

test('@tools/src/collect/structures/grid', () => {
  const _ = setup(() => {
    const grid = new Grid<string|null>();
    grid.set(0, 0, '0,0');
    grid.set(0, 1, '0,1');
    grid.set(0, 2, '0,2');

    grid.set(1, 0, '1,0');

    grid.set(1, 2, '1,2');

    grid.set(2, 0, '2,0');
    grid.set(2, 1, '2,1');
    grid.set(2, 2, null);

    return {grid};
  });

  test('iterator', () => {
    should('return the correct entries', () => {
      assert([..._.grid]).to.haveExactElements([
        objectThat<GridEntry<string>>().haveProperties({x: 0, y: 0, value: '0,0'}),
        objectThat<GridEntry<string>>().haveProperties({x: 0, y: 1, value: '0,1'}),
        objectThat<GridEntry<string>>().haveProperties({x: 0, y: 2, value: '0,2'}),

        objectThat<GridEntry<string>>().haveProperties({x: 1, y: 0, value: '1,0'}),
        objectThat<GridEntry<string>>().haveProperties({x: 1, y: 2, value: '1,2'}),

        objectThat<GridEntry<string>>().haveProperties({x: 2, y: 0, value: '2,0'}),
        objectThat<GridEntry<string>>().haveProperties({x: 2, y: 1, value: '2,1'}),
        objectThat<GridEntry<string|null>>().haveProperties({x: 2, y: 2, value: null}),
      ]);
    });
  });

  test('as2dArray', () => {
    should('return the correct 2d array', () => {
      assert(_.grid.as2dArray()).to.haveExactElements([
        arrayThat<string>().haveExactElements(['0,0', '1,0', '2,0']),
        arrayThat<string|undefined>().haveExactElements(['0,1', undefined, '2,1']),
        arrayThat<string|null>().haveExactElements(['0,2', '1,2', null]),
      ]);
    });
  });

  test('get', () => {
    should('return the correct value if exists', () => {
      assert(_.grid.get(2, 1)).to.equal('2,1');
    });

    should('return the correct value if null', () => {
      assert(_.grid.get(2, 2)).to.beNull();
    });

    should('return undefined if the entry does not exist', () => {
      assert(_.grid.get(1, 1)).toNot.beDefined();
    });
  });

  test('has', () => {
    should('return true if exists', () => {
      assert(_.grid.has(2, 1)).to.beTrue();
    });

    should('return false if the entry does not exist', () => {
      assert(_.grid.has(1, 1)).to.beFalse();
    });
  });

  test('length', () => {
    should('return the correct number of entries', () => {
      assert(_.grid.length).to.equal(8);
    });
  });

  test('maxX', () => {
    should('return the correct max X', () => {
      assert(_.grid.maxX).to.equal(2);
    });
  });

  test('maxY', () => {
    should('return the correct max Y', () => {
      assert(_.grid.maxY).to.equal(2);
    });
  });

  test('set', () => {
    should('add the entry correctly', () => {
      _.grid.set(1, 1, 'new');

      assert(_.grid.get(1, 1)).to.equal('new');
    });

    should('replace the previous entry if already populated', () => {
      _.grid.set(0, 0, 'new');

      assert([..._.grid]).to.haveExactElements([
        objectThat<GridEntry<string>>().haveProperties({x: 0, y: 1, value: '0,1'}),
        objectThat<GridEntry<string>>().haveProperties({x: 0, y: 2, value: '0,2'}),

        objectThat<GridEntry<string>>().haveProperties({x: 1, y: 0, value: '1,0'}),
        objectThat<GridEntry<string>>().haveProperties({x: 1, y: 2, value: '1,2'}),

        objectThat<GridEntry<string>>().haveProperties({x: 2, y: 0, value: '2,0'}),
        objectThat<GridEntry<string>>().haveProperties({x: 2, y: 1, value: '2,1'}),
        objectThat<GridEntry<string|null>>().haveProperties({x: 2, y: 2, value: null}),
        objectThat<GridEntry<string>>().haveProperties({x: 0, y: 0, value: 'new'}),
      ]);
    });
  });

  test('gridFrom', () => {
    should('create the grid correctly', () => {
      const grid = gridFrom([
        [1, 2, 3],
        [4, 5, 6],
      ]);

      assert(grid.get(0, 0)).to.equal(1);
      assert(grid.get(1, 0)).to.equal(2);
      assert(grid.get(2, 0)).to.equal(3);

      assert(grid.get(0, 1)).to.equal(4);
      assert(grid.get(1, 1)).to.equal(5);
      assert(grid.get(2, 1)).to.equal(6);
    });
  });
});