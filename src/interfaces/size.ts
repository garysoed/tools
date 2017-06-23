export type Unit =
  'cap' |
  'ch' |
  'cm' |
  'em' |
  'ex' |
  'ic' |
  'in' |
  'lh' |
  'mm' |
  'pc' |
  'pt' |
  'px' |
  'q' |
  'rem' |
  'rlh' |
  'vb' |
  'vh' |
  'vi' |
  'vmin' |
  'vmax' |
  'vw';
export type Size = {unit: Unit, value: number};

export const UNITS: Unit[] = [
  'cap',
  'rem',
  'rlh',
  'vmin',
  'vmax',
  'ch',
  'cm',
  'em',
  'ex',
  'ic',
  'in',
  'lh',
  'mm',
  'pc',
  'pt',
  'px',
  'vb',
  'vh',
  'vi',
  'vw',
  'q',
];
