import { Entity } from '@shared/domain/building-blocks/Entity';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { InMemoryDomainEventPublisher } from '@shared/domain/events/InMemoryDomainEventPublisher';
import { IDomainEventPublisher } from '@shared/domain/interfaces/IDomainEventPublisher';
import { IEntityProps } from '@shared/domain/interfaces/IEntityProps';
import { IWithDomainEvent } from '@shared/domain/interfaces/IWithDomainEvent';

/**
 * Abstract class that represents an aggregate root in a domain-driven design architecture.
 *
 * @template T - The type of the aggregate root entity properties.
 * @abstract
 * @class AggregateRoot
 * @extends {Entity<T>}
 * @implements {IWithDomainEvent}
 */
export abstract class AggregateRoot<T extends IEntityProps>
  extends Entity<T>
  implements IWithDomainEvent
{
  /**
   * Creates an instance of AggregateRoot.
   *
   * @param {T} props - The properties of the aggregate root entity.
   * @param {IDomainEventPublisher} [eventsPublisher=InMemoryDomainEventPublisher.getInstance()] - The domain event publisher used by the aggregate root to publish and dispatch events.
   * @memberof AggregateRoot
   */
  public constructor(
    props: T,
    private eventsPublisher: IDomainEventPublisher = InMemoryDomainEventPublisher.getInstance()
  ) {
    super(props);
  }

  /**
   * Raises a domain event by publishing it to the domain event publisher.
   *
   * @param {IDomainEvent} domainEvent - The domain event to raise.
   * @memberof AggregateRoot
   */
  raiseDomainEvent(domainEvent: IDomainEvent): void {
    this.eventsPublisher.publish(domainEvent);
  }

  /**
   * Gets the domain events that have been raised by the aggregate root.
   *
   * @returns {IDomainEvent[]}
   * @memberof AggregateRoot
   */
  getDomainEvents(): IDomainEvent[] {
    return this.eventsPublisher.getAggregateRootEvents(this.id);
  }

  /**
   * Clears all the domain events that have been raised by the aggregate root.
   *
   * @memberof AggregateRoot
   */
  clearDomainEvents(): void {
    this.eventsPublisher.clearAggregateRootEvents(this.id);
  }

  /**
   * Abstract method that must be implemented by each concrete aggregate root to register its domain event handlers as subscribers to the domain event publisher.
   *
   * @abstract
   * @memberof AggregateRoot
   */
  abstract registerDomainEventHandlers(): void;

  /**
   * Dispatches all the domain events that have been raised by the aggregate root.
   *
   * @memberof AggregateRoot
   */
  dispatchDomainEvents(): void {
    this.eventsPublisher.dispatchAggregateRootEvents(this.id);
  }

  /**
   * Dispatches a domain event by name.
   *
   * @param {string} domainEventName - The name of the domain event to dispatch.
   * @memberof AggregateRoot
   */
  dispatchDomainEventByName(domainEventName: string): void {
    this.eventsPublisher.dispatchAggregateRootEventByName(
      this.id,
      domainEventName
    );
  }
}
