import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';

export interface IDomainEvent {
  /**
   * The name of the event.
   *
   * @type {string}
   *
   * @memberof IDomainEvent
   * */
  readonly eventName: string;

  /**
   * The date and time the event was created.
   *
   * @type {DateTimeValueObject}
   * @memberof IDomainEvent
   */
  occurredAt: DateTimeValueObject;

  /**
   * The unique identifier of the aggregate root that the event is associated with.
   *
   * @type {UniqueUUID}
   *
   * @memberof IDomainEvent
   * */

  aggregateRootId: UniqueUUID;
}
