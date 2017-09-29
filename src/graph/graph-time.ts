export class GraphTime {
  constructor(private readonly timestamp_: number) { }

  before(other: GraphTime): boolean {
    return this.timestamp_ < other.timestamp_;
  }

  beforeOrEqualTo(other: GraphTime): boolean {
    return this.timestamp_ <= other.timestamp_;
  }

  /**
   * Increments the time. This guarantees that the new time is greater than the previous one but
   * does not guarantee equality with other times. E.g.: time.increment() and time.increment() may
   * be different.
   */
  increment(): GraphTime {
    return new GraphTime(this.timestamp_ + 1);
  }

  toString(): string {
    return `GraphTime(${this.timestamp_})`;
  }

  value_(): number {
    return this.timestamp_;
  }

  /**
   * Creates a new timestamp. This does not guarantee that two graph times are the same. E.g.
   * GraphTime.new() and GraphTime.new() may have different timestamps.
   */
  static new(): GraphTime {
    return new GraphTime(0);
  }
}
