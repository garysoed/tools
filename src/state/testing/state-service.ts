import { SequentialIdGenerator } from '../../random/sequential-id-generator';
import { StateService } from '../state-service';

export function fakeStateService(): StateService {
  return new StateService(new SequentialIdGenerator());
}
