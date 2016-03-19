interface FormData extends Array<any> {
  append(name: string, value: string, filename?: string): void;
  delete(name: string): void;
  set(name: string, value: string, filename?: string): void;
}
