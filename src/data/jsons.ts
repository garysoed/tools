/**
 * Various utility methods to work with JSONs.
 */
import { Errors } from '../error';

interface Json {
  [key: string]: any;
}

/**
 * Searchs for the value in the JSON at the given path.
 *
 * @param json The object to get the value of.
 * @param path `.` separatedpath to the location of the value to obtain.
 * @return The value at the given location, or undefined if none exists.
 */
export function getValue(json: Json, path: string): any {
  const parts = path.split('.');
  let object = json;
  for (let i = 0; i < parts.length && !!object; i++) {
    object = object[parts[i]];
  }

  return object;
}

/**
 * Sets the value of the given object at the given path.
 *
 * For example:
 *
 * ```typescript
 * import Jsons from './jsons';
 *
 * Jsons.setValue(window, 'a.b.c', 123);
 * expect(window.a.b.c).toEqual(123);
 * ```
 *
 * @param json The object to set the value of.
 * @param path `.` separated path to the location of the value to set.
 * @param value The value to set.
 */
export function setValue(json: Json, path: string, value: unknown): void {
  const parts = path.split('.');
  const propertyName = parts.pop();
  if (!propertyName) {
    throw Errors.assert('path').should('not be empty').butWas(path);
  }

  let object = json;
  parts.forEach((part: string) => {
    if (object[part] === undefined) {
      object[part] = {};
    }
    object = object[part];
  });

  object[propertyName] = value;
}
