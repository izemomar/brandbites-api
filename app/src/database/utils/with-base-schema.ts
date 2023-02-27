import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';

/**
 * A higher-order function that adds common columns to a given EntitySchema.
 *
 * @param Schema The EntitySchema to extend.
 *
 * @returns The modified EntitySchema.
 */
export function withBaseSchema<T extends EntitySchema>(entitySchema: T): T {
  entitySchema.options.columns = {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    } as EntitySchemaColumnOptions,
    ...entitySchema.options.columns,
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    } as EntitySchemaColumnOptions,
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
      nullable: true
    } as EntitySchemaColumnOptions,
    deletedAt: {
      name: 'deleted_at',
      type: 'timestamp',
      nullable: true,
      deleteDate: true
    } as EntitySchemaColumnOptions
  };

  return entitySchema;
}
