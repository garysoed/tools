import { Serializable } from 'nabu';

export interface IsSerializable {
  serialize(): Serializable;
}
