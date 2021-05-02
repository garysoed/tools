import {RandomGen} from './random-gen';


export function mathGen(): RandomGen {
  return {
    next(): [RandomGen, number] {
      return [mathGen(), Math.random()];
    },
  };
}
