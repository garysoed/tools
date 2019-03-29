import { Serializable } from '@nabu/main';

export interface IsSerializable {
  serialize(): Serializable;
}
