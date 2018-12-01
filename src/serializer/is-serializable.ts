import { Serializable } from 'nabu/export/main';

export interface IsSerializable {
  serialize(): Serializable;
}
