import {Modifier} from '../src/state/state-service';
export type {Modifier};

export {Snapshot} from '../src/state/snapshot';
export {createId, StateId} from '../src/state/state-id';
export {Resolver, StateService} from '../src/state/state-service';
export {Resolver2, StateService2, MutableState, RootStateId, ObjectPath, createRootStateId, mutableState, createObjectPath, PathProvider} from '../src/state/state-service-2';

export {fakeStateService} from '../src/state/testing/state-service';
export {fakeStateService2} from '../src/state/testing/state-service-2';