import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';
import { AggregateRoot } from '@shared/domain/building-blocks/AggregateRoot';

export interface IDomainEventPublisher {
  /**
   * Publishes a domain event.
   *
   * @param {IDomainEvent} domainEvent The domain event to publish.
   *
   * @returns {Promise<void>} A promise that resolves when the domain event has been published.
   *
   * @memberof IDomainEventPublisher
   */
  publish(domainEvent: IDomainEvent): Promise<void>;

  /**
   * Registers a domain event handler.
   *
   * @param {IDomainEventHandler<T>} domainEventHandler The domain event handler to register.
   * @param {string} domainEventName The name of the domain event to register the handler for.
   *
   * @memberof IDomainEventPublisher
   */
  registerHandler<T extends IDomainEvent>(
    domainEventHandler: IDomainEventHandler<T>,
    domainEventName: string
  ): void;

  /**
   * Gets the domain events for the specified aggregate root.
   *
   * @param {UniqueUUID} aggregateRootId The ID of the aggregate root to get the domain events for.
   *
   * @returns {IDomainEvent[]} The domain events for the specified aggregate root.
   *
   * @memberof IDomainEventPublisher
   */
  getAggregateRootEvents(aggregateRootId: UniqueUUID): IDomainEvent[];

  /**
   * Dispatches the domain events for the specified aggregate root.
   *
   * @param {UniqueUUID} aggregateRootId The ID of the aggregate root to dispatch the domain events for.
   *
   * @returns {Promise<void>} A promise that resolves when all domain events have been dispatched.
   *
   * @memberof IDomainEventPublisher
   */
  dispatchAggregateRootEvents(aggregateRootId: UniqueUUID): Promise<void>;

  /**
   * Dispatch an event by name for the specified aggregate root.
   *
   * @param {UniqueUUID} aggregateRootId The ID of the aggregate root to dispatch the domain events for.
   * @param {string} eventName The name of the event to dispatch.
   *
   * @returns {Promise<void>} A promise that resolves when all domain events have been dispatched.
   *
   * @memberof IDomainEventPublisher
   */
  dispatchAggregateRootEventByName(
    aggregateRootId: UniqueUUID,
    eventName: string
  ): Promise<void>;

  /**
   * Clears the domain events for the specified aggregate root.
   *
   * @param {UniqueUUID} aggregateRootId The ID of the aggregate root to clear the domain events for.
   *
   * @memberof IDomainEventPublisher
   */
  clearAggregateRootEvents(aggregateRootId: UniqueUUID): void;
}
