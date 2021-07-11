import {Type} from 'gs-types';

import {MutableState} from './mutable-state';


const __unusedObjectPath = Symbol('unusedObjectPath');

export interface ObjectPath<T> {
  readonly id: string;
  readonly [__unusedObjectPath]: Type<T>;
}

export function createObjectPath<T>(id: string): ObjectPath<T> {
  return {id, [__unusedObjectPath]: {} as any};
}


export function isObjectPath<T>(target: Partial<ObjectPath<T>>): target is ObjectPath<T> {
  return !!target[__unusedObjectPath];
}


export const IMMUTABLE_PATH_PREFIX = 'i';
export const MUTABLE_PATH_PREFIX = 'm';

export function immutablePathOf(mutable: null|undefined): undefined;
export function immutablePathOf<T>(mutable: ObjectPath<MutableState<T>>): ObjectPath<T>;
export function immutablePathOf<T>(mutable: ObjectPath<MutableState<T>>|null|undefined): ObjectPath<T>|undefined;
export function immutablePathOf<T>(mutable: ObjectPath<T>): ObjectPath<T>;
export function immutablePathOf<T>(mutable: ObjectPath<T>|null|undefined): ObjectPath<T>|undefined;
export function immutablePathOf<T>(mutable: ObjectPath<MutableState<T>>|null|undefined): ObjectPath<T>|undefined {
  if (!mutable) {
    return undefined;
  }
  const [, baseId] = mutable.id.split('::');
  return createObjectPath(`${IMMUTABLE_PATH_PREFIX}::${baseId}`);
}

export function isObjectPathEqual(path1: ObjectPath<unknown>, path2: ObjectPath<unknown>): boolean {
  const [, baseId1] = path1.id.split('::');
  const [, baseId2] = path2.id.split('::');
  return baseId1 === baseId2;
}