export default {
  mapValue<V1, V2>(record: { [key: string]: V1 }, fn: (arg: V1) => V2): { [key: string]: V2 } {
    let out = <{[key: string]: V2}> {};
    for (let key in record) {
      out[key] = fn(record[key]);
    }
    return out;
  }
};
