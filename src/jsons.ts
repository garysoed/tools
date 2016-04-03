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
