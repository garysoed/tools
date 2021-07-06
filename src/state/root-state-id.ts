import {Type} from 'gs-types';

const __unusedRootStateId = Symbol('unusedRootStateId');

export interface RootStateId<T> {
  readonly [__unusedRootStateId]: Type<T>;
  readonly id: string;
}

export function createRootStateId<T>(innerValue: string): RootStateId<T> {
  return {id: innerValue, [__unusedRootStateId]: {} as any};
}