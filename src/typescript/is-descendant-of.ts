export function isDescendantOf(descendantCtor: Function, ancestorCtor: Function): boolean {
  return descendantCtor.prototype instanceof ancestorCtor;
}
