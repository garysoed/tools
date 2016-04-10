declare module gs {
  interface ICtor<T> {
    new (...args: any[]): T;
    length: number;
  }

  interface IEnum {
    [key: number]: string;
  }

  interface IJson {
    [key: string]: any;
  }
}
