export function verifyNoCalls(instance: Function): void {
  expect(instance).not.toHaveBeenCalled();
}
