import {SequentialIdGenerator} from '../../random/idgenerators/sequential-id-generator';
import {StateService2} from '../state-service-2';

export function fakeStateService2(): StateService2 {
  return new StateService2(new SequentialIdGenerator());
}
