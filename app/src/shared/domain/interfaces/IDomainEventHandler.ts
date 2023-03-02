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
   * Subscribes the handler to the domain event publisher.
   *
   * @memberof IDomainEventHandler
   * */
  subscribeTo(): void;
}
