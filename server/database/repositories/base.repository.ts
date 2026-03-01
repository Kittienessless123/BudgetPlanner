// base/base.repository.ts
import { type IRepository } from './repository.types.ts';
import { Model, type ModelCtor, type WhereOptions } from 'sequelize';

export abstract class BaseRepository<T extends Model> implements IRepository<T> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async findById(id: string | number): Promise<T | null> {
    try {
      const record = await this.model.findByPk(id);
      return record;
    } catch (error) {
      throw new Error(`Error finding record by id: ${error}`);
    }
  }

  async findAll(filter?: Partial<T>): Promise<T[]> {
    try {
      const where = filter as unknown as WhereOptions<T> || {};
      return await this.model.findAll({ where });
    } catch (error) {
      throw new Error(`Error finding records: ${error}`);
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      return await this.model.create(data as any);
    } catch (error) {
      throw new Error(`Error creating record: ${error}`);
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    try {
      const record = await this.findById(id);
      if (!record) return null;

      await record.update(data as any);
      return record;
    } catch (error) {
      throw new Error(`Error updating record: ${error}`);
    }
  }

  async delete(id: string | number): Promise<boolean> {
    try {
      const deleted = await this.model.destroy({
        where: { id } as unknown as WhereOptions<T>
      });
      return deleted > 0;
    } catch (error) {
      throw new Error(`Error deleting record: ${error}`);
    }
  }

  async count(filter?: Partial<T>): Promise<number> {
    try {
      const where = filter as unknown as WhereOptions<T> || {};
      return await this.model.count({ where });
    } catch (error) {
      throw new Error(`Error counting records: ${error}`);
    }
  }
}