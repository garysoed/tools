import Records from './records';

describe('collection.Records', () => {
  describe('mapValue', () => {
    it('should map the values of the given array', () => {
      let record = <{ [key: string]: string }> {
        a: 'a',
        b: 'b',
      };
      let out = Records.mapValue(record, (value: string) => `${value}_`);
      expect(out).toEqual({ 'a': 'a_', 'b': 'b_' });
    });
  });
});
