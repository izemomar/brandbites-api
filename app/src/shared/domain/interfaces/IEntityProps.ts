import { DateTimeValueObject } from '../value-objects/DateTimeValueObject';
import { UniqueUUID } from '@shared/domain//value-objects/UniqueUUID';

export interface IEntityProps {
  id?: UniqueUUID;
  createdAt?: DateTimeValueObject;
  updatedAt?: DateTimeValueObject;
  deletedAt?: DateTimeValueObject;
}
