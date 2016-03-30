declare module gs {
  interface ICtor<T> {
    new (...args: any[]): T;
  }

  interface IEnum {
    [key: number]: string;
  }

  interface IJson {
    [key: string]: any;
  }
}
