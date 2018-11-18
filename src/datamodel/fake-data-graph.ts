// import { DataGraph } from '../datamodel/data-graph';
// import { ImmutableList, ImmutableMap, ImmutableSet } from '../immutable';

// export class FakeDataGraph<T> implements DataGraph<T> {
//   private readonly data_: Map<string, T> = new Map();

//   async delete(id: string): Promise<void> {
//     this.data_.delete(id);
//   }

//   generateId(): Promise<string> {
//     throw new Error('Method not implemented.');
//   }

//   async get(id: string): Promise<T | null> {
//     const data = this.data_.get(id);
//     return data === undefined ? null : data;
//   }

//   async list(): Promise<ImmutableSet<T>> {
//     return ImmutableMap.of(this.data_).values();
//   }

//   search(): Promise<ImmutableList<T>> {
//     throw new Error('Method not implemented.');
//   }

//   async set(id: string, data: T): Promise<void> {
//     this.data_.set(id, data);
//   }
// }
