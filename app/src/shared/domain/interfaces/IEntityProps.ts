import { DeletedAt } from '@shared/domain/value-objects/DeletedAt';
import { UpdatedAt } from '@shared/domain/value-objects/UpdatedAt';
import { CreatedAt } from '@shared/domain/value-objects/CreatedAt';
import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { UniqueUUID } from '@shared/domain//value-objects/UniqueUUID';

/**
 * The interface that describes the common properties of an entity.
 *
 * @interface
 * @name IEntityProps
 */
export interface IEntityProps {
  id?: UniqueUUID;
  createdAt?: CreatedAt;
  updatedAt?: UpdatedAt;
  deletedAt?: DeletedAt;
}
