export default {
  deepClone(original: gs.IJson): gs.IJson {
    return JSON.parse(JSON.stringify(original));
  },

  mixin(fromObj: gs.IJson, toObj: gs.IJson): void {
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
  },
};
