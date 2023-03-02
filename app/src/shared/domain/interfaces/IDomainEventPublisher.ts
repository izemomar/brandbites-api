import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';

export interface IDomainEventPublisher {
  /**
   * Publishes a domain event.
   *
   * @param domainEvent The domain event to publish.
   *
   * @returns A promise that resolves when the domain event has been published.
   *
   * @memberof IDomainEventPublisher
   * */
  publish(domainEvent: IDomainEvent): Promise<void>;

  /**
   * Publishes a list of domain events.
   *
   * @param domainEvents The domain events to publish.
   *
   * @returns A promise that resolves when all domain events have been published.
   *
   * @memberof IDomainEventPublisher
   * */
  publishMany(domainEvents: IDomainEvent[]): Promise<void>;

  /**
   * Registers a domain event handler.
   *
   * @param domainEventHandler The domain event handler to register.
   * @param domainEvent The domain event to register the handler for.
   *
   * */

  registerHandler<T extends IDomainEvent>(
    domainEventHandler: IDomainEventHandler<T>,
    domainEventName: string
  ): void;

  /**
   * Gets the domain events for the specified aggregate root.
   *
   * @param aggregateRootId The aggregate root id.
   *
   * @returns {IDomainEvent[]}
   *
   * @memberof IDomainEventPublisher
   * */
  getAggregateRootEvents(aggregateRootId: UniqueUUID): IDomainEvent[];

  /**
   * Dispatches the domain events for the specified aggregate root.
   *
   * @param aggregateRootId The aggregate root id.
   *
   * @returns {Promise<void>}
   *
   * @memberof IDomainEventPublisher
   * */
  dispatchAggregateRootEvents(aggregateRootId: UniqueUUID): Promise<void>;
}
