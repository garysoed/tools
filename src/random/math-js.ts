import {Rng} from './rng';


export class MathJs implements Rng {
  next(): number {
    return Math.random();
  }
}
