import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';

export interface IDomainEvent {
  /**
   * The id of the event.
   *
   * @type {UniqueUUID}
   *
   * @memberof IDomainEvent
   * */
  readonly _id: UniqueUUID;

  /**
   * The name of the event.
   *
   * @type {string}
   *
   * @memberof IDomainEvent
   * */
  readonly _eventName: string;

  /**
   * The date and time the event was created.
   *
   * @type {DateTimeValueObject}
   * @memberof IDomainEvent
   */
  readonly _occurredAt: DateTimeValueObject;

  /**
   * The id of the event.
   *
   * @type {UniqueUUID}
   *
   * @memberof IDomainEvent
   * */
  get id(): UniqueUUID;

  /**
   * The name of the event.
   *
   * @type {string}
   *
   * @memberof IDomainEvent
   * */
  get name(): string;

  /**
   * The id of the aggregate root that generated the event.
   *
   * @type {UniqueUUID}
   *
   * @memberof IDomainEvent
   * */
  get aggregateRootId(): UniqueUUID;

  /**
   * The date and time the event was created.
   *
   * @type {DateTimeValueObject}
   *
   * @memberof IDomainEvent
   * */
  get occurredAt(): DateTimeValueObject;

  /**
   * Determines whether the specified domain event is equal to this domain event.
   *
   * @param {IDomainEvent} other The domain event to compare with this domain event.
   *
   * @returns {boolean} True if the specified domain event is equal to this domain event; otherwise, false.
   *
   * @memberof IDomainEvent
   * */
  equals(other: IDomainEvent): boolean;
}
