import {assert, should, test} from 'gs-testing';

import {mapObject} from './map-object';

interface TestFrom {
  readonly a: number;
  readonly b: number;
}

interface TestTo {
  readonly a: string;
  readonly b: string;
}

test('@tools/typescript/map-object', () => {
  should('map the values correctly', () => {
    const result = mapObject<TestFrom, TestTo>(
      {a: 1, b: 2},
      (key, value) => `${key}:${value}`,
    );
    assert(result).to.haveProperties({a: 'a:1', b: 'b:2'});
  });
});
