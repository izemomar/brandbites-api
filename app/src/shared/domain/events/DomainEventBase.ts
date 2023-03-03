import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';

export abstract class DomainEventBase implements IDomainEvent {
  readonly _id: UniqueUUID;

  constructor(
    public readonly _eventName: string = DomainEventBase.constructorName(),
    public readonly _occurredAt: DateTimeValueObject = DateTimeValueObject.now()
  ) {
    this._id = UniqueUUID.generate();
  }

  private static constructorName(): string {
    return this.prototype.constructor.name;
  }

  /**
   * The id of the event.
   *
   * @type {UniqueUUID}
   * */
  public get id(): UniqueUUID {
    return this._id;
  }

  /**
   * The name of the event.
   *
   * @type {string}
   * */
  public get name(): string {
    return this._eventName;
  }

  /**
   * The date and time the event was created.
   *
   * @type {DateTimeValueObject}
   */
  public get occurredAt(): DateTimeValueObject {
    return this._occurredAt;
  }

  abstract get aggregateRootId(): UniqueUUID;

  public equals(other: IDomainEvent): boolean {
    return (
      this.id.equals(other.id) &&
      this.name === other.name &&
      this.aggregateRootId.equals(other.aggregateRootId)
    );
  }
}
