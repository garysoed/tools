/**
 * Various utility methods to work with JSONs.
 *
 * @TODO Turn this into Fluent
 */
import { Errors } from '../error';

export function clone<T extends gs.IJson>(original: gs.IJson): T {
  const cloneObj = {};
  for (const key in original) {
    if (original.hasOwnProperty(key)) {
      cloneObj[key] = original[key];
    }
  }

  return cloneObj as T;
}

/**
 * Recursively clones the given JSON.
 *
 * @param original The JSON to be cloned.
 * @return The cloned JSON.
 */
export function deepClone(original: gs.IJson): gs.IJson {
  return JSON.parse(JSON.stringify(original));
}

/**
 * Searchs for the value in the JSON at the given path.
 *
 * @param json The object to get the value of.
 * @param path `.` separatedpath to the location of the value to obtain.
 * @return The value at the given location, or undefined if none exists.
 */
export function getValue(json: gs.IJson, path: string): any {
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
export function setValue(json: gs.IJson, path: string, value: any): void {
  if (path === '') {
    throw Errors.assert('path').should('not be empty').butWas(path);
  }

  let object = json;
  const parts = path.split('.');
  const propertyName: string = parts.pop();

  parts.forEach((part: string) => {
    if (object[part] === undefined) {
      object[part] = {};
    }
    object = object[part];
  });

  object[propertyName] = value;
}
