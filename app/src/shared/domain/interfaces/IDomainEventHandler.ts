import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';

export interface IDomainEventHandler<T extends IDomainEvent> {
  /**
   * Handles a domain event.
   *
   * @param domainEvent The domain event to handle.
   *
   * @returns A promise that resolves when the domain event has been handled.
   *
   * @memberof IDomainEventHandler
   * */
  handle(domainEvent: T): Promise<void>;

  /**
   * Returns true if the handler can handle the specified domain event.
   *
   * @param domainEvent The domain event to check.
   *
   * @returns True if the handler can handle the specified domain event.
   *
   * @memberof IDomainEventHandler
   * */
  canHandle(domainEvent: IDomainEvent): domainEvent is T;

  /**
   * Subscribes the handler to the domain event publisher.
   *
   * @memberof IDomainEventHandler
   * */
  subscribeTo(): void;
}
