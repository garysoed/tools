import {Color} from './color';

export class RgbColor extends Color {
  constructor(red: number, green: number, blue: number) {
    super(`rgb(${red} ${green} ${blue})`);
  }
}
