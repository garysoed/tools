import Asserts from './assert/asserts';

/**
 * Various utility methods to work with JSONs.
 *
 * @TODO Turn this into Fluent
 */
class Jsons {
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
    Asserts.string(path).toNot.beEmpty().orThrowsMessage(`Expected ${path} to not be empty`);

    let object = json;
    let parts = path.split('.');
    let propertyName = parts.pop();

    parts.forEach((part: string) => {
      if (object[part] === undefined) {
        object[part] = {};
      }
      object = object[part];
    });

    object[propertyName] = value;
  }

  /**
   * Mixins the two given JSONs.
   *
   * This will deep clone any objects in the fromObj. This will also overwrites any keys in the
   * toObj with the value in fromObj.
   *
   * @param fromObj The source object to do the mixin.
   * @param toObj The destination of the mixin.
   * @param {gs.IJson} fromObj [description]
   * @param {gs.IJson} toObj [description]
   */
  static mixin(fromObj: gs.IJson, toObj: gs.IJson): void {
    for (let key in fromObj) {
      let value = fromObj[key];
      if (toObj[key] !== undefined) {
        if (typeof toObj[key] === 'object') {
          this.mixin(value, toObj[key]);
        }
      } else {
        toObj[key] = this.deepClone(value);
      }
    }
  }
};

export default Jsons;
