/**
 * Various utility methods to work with JSONs.
 *
 * @TODO Turn this into Fluent
 */
export class Jsons {
  /**
   * Recursively clones the given JSON.
   *
   * @param original The JSON to be cloned.
   * @return The cloned JSON.
   */
  static deepClone(original: gs.IJson): gs.IJson {
    return JSON.parse(JSON.stringify(original));
  }

  /**
   * Searchs for the value in the JSON at the given path.
   *
   * @param json The object to get the value of.
   * @param path `.` separatedpath to the location of the value to obtain.
   * @return The value at the given location, or undefined if none exists.
   */
  static getValue(json: gs.IJson, path: string): any {
    const parts = path.split('.');
    let object = json;
    for (let i = 0; i < parts.length && !!object; i++) {
      object = object[parts[i]];
    }
    return object;
  }

  /**
   * Mixins the two given JSONs.
   *
   * This will deep clone any objects in the fromObj. This will also overwrites any keys in the
   * toObj with the value in fromObj.
   *
   * @param fromObj The source object to do the mixin.
   * @param toObj The destination of the mixin.
   * @param {gs.IJson } fromObj [description]
   * @param {gs.IJson} toObj [description]
   */
  static mixin<A extends gs.IJson, B extends gs.IJson>(fromObj: A, toObj: B): A & B {
    for (const key in fromObj) {
      const value = fromObj[key];
      if (toObj[key] !== undefined) {
        if (typeof toObj[key] === 'object') {
          this.mixin(value as any, toObj[key] as any);
        }
      } else {
        toObj[key] = this.deepClone(value as any) as any;
      }
    }
    return toObj as A & B;
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
  static setValue(json: gs.IJson, path: string, value: any): void {
    if (path === '') {
      throw new Error(`Expected ${path} to not be empty`);
    }

    let object = json;
    const parts = path.split('.');
    const propertyName: string = parts.pop()!;

    parts.forEach((part: string) => {
      if (object[part] === undefined) {
        object[part] = {};
      }
      object = object[part];
    });

    object[propertyName] = value;
  }
}
