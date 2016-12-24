import {Maps} from 'src/collection/maps';
import {Stringify} from 'src/data/stringify';

import {AnyValidations} from './any-validations';
import {ValidationResult} from './validation-result';


/**
 * Validations for any maps.
 */
export class MapValidations extends AnyValidations<Map<any, any>> {
  private mapValue_: Map<any, any>;

  /**
   * @param value The string value to check.
   * @param reversed True iff the check logic should be reversed.
   */
  constructor(value: Map<any, any>, reversed: boolean) {
    super(value, reversed);
    this.mapValue_ = value;
  }

  /**
   * Validates that the map contains the given key.
   *
   * @param key The key to check.
   */
  containKey(key: any): ValidationResult<Map<any, any>> {
    return this.resolve(this.mapValue_.has(key), `contain key "${key}"`);
  }

  /**
   * @override
   */
  getValueAsString(): string {
    return Stringify.toString(Maps.of(this.mapValue_).asRecord());
  }
}
