export class Vector2d {
  constructor(
      readonly x: number,
      readonly y: number) { }

  add(other: Vector2d): Vector2d {
    return new Vector2d(this.x + other.x, this.y + other.y);
  }

  getLength(): number {
    return Math.sqrt(this.getLengthSquared());
  }

  getLengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  mult(n: number): Vector2d {
    return new Vector2d(this.x * n, this.y * n);
  }

  static of(x: number, y: number): Vector2d {
    return new Vector2d(x, y);
  }
}
