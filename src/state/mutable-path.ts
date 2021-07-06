import {Type} from 'gs-types';

import {MutableState} from './mutable-state';
import {ImmutableResolver} from './resolver';

const __unusedMutablePath = Symbol('unusedMutablePath');

export interface MutablePath<T> {
  readonly id: string;
  readonly [__unusedMutablePath]: Type<T>;
}

export function createMutablePath<T>(innerValue: string): MutablePath<T> {
  return {id: innerValue, [__unusedMutablePath]: {} as any};
}

export type PathProvider<R, T> = (root: ImmutableResolver<R>) => ImmutableResolver<MutableState<T>>;


export function isMutablePath<T>(target: Partial<MutablePath<T>>): target is MutablePath<T> {
  return !!target[__unusedMutablePath];
}