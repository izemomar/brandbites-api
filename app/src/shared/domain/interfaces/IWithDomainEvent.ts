import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';

export interface IWithDomainEvent {
  /**
   * Raises a domain event.
   *
   * @param {IDomainEvent} domainEvent The domain event to raise.
   *
   * @memberof IWithDomainEvent
   * */
  raiseDomainEvent(domainEvent: IDomainEvent): void;

  /**
   * Gets the domain events.
   *
   * @returns {IDomainEvent[]} The domain events.
   *
   * @memberof IWithDomainEvent
   * */
  getDomainEvents(): IDomainEvent[];

  /**
   * Clears the domain events for the current aggregate root.
   *
   * @memberof IWithDomainEvent
   *
   * */
  clearDomainEvents(): void;

  /**
   * Registers a domain event handlers as a subscriber to the domain event publisher.
   *
   * @memberof IWithDomainEvent
   * */
  registerDomainEventHandlers(): void;

  /**
   * Dispatches the domain events for the current aggregate root.
   *
   * @memberof IWithDomainEvent
   * */
  dispatchDomainEvents(): void;

  /**
   * Dispatch a domain event by name for the current aggregate root.
   */
  dispatchDomainEventByName(domainEventName: string): void;
}
