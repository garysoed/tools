class BaseFluent<T> {
  private data_: T;

  constructor(data: T) {
    this.data_ = data;
  }

  get data(): T {
    return this.data_;
  }
}

export default BaseFluent;
