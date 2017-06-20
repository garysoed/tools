export interface DataBridge<T> {
  create: (document: Document, instance: any) => Element;
  get: (element: Element) => T | null;
  set: (data: T, element: Element, instance: any) => void;
}
