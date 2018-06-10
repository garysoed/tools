import { ImmutableSet } from '../immutable';
import { BaseIdGenerator } from '../random/base-id-generator';
import { EditableStorage } from './editable-storage';

export class InMemoryStorage<T> implements EditableStorage<T> {
  private readonly data_: Map<string, T> = new Map();

  constructor(private readonly idGenerator_: BaseIdGenerator) { }

  async delete(id: string): Promise<void> {
    this.data_.delete(id);
  }

  async generateId(): Promise<string> {
    return this.idGenerator_.generate(this.data_.keys());
  }

  async has(id: string): Promise<boolean> {
    return this.data_.has(id);
  }

  async list(): Promise<ImmutableSet<T>> {
    return ImmutableSet.of(this.data_.values());
  }

  async listIds(): Promise<ImmutableSet<string>> {
    return ImmutableSet.of(this.data_.keys());
  }

  async read(id: string): Promise<T | null> {
    return this.data_.get(id) || null;
  }

  async update(id: string, instance: T): Promise<void> {
    this.data_.set(id, instance);
  }
}
