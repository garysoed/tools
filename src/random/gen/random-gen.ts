export interface RandomGen {
  next(): readonly [RandomGen, number];
}
