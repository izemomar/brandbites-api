import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';
import { IDomainEventPublisher } from '@shared/domain/interfaces/IDomainEventPublisher';
import { AggregateRoot } from '@shared/domain/building-blocks/AggregateRoot';
import { IEntityProps } from '@shared/domain/interfaces/IEntityProps';

/**
 * @example
 * const aggregateRoot: TAggregateRootWithEvents = {
 *  id: new UniqueUUID(),
 *  pendingEvents: [],
 * };
 */
type TAggregateRootWithEventsList = {
  id: UniqueUUID;
  readonly pendingEvents: IDomainEvent[];
};

export class InMemoryDomainEventPublisher implements IDomainEventPublisher {
  private static instance: InMemoryDomainEventPublisher;
  private readonly pendingEvents: TAggregateRootWithEventsList[] = [];

  private readonly handlers = new Map<
    string,
    IDomainEventHandler<IDomainEvent>[]
  >(); // <IDomainEvent.name, handlers[]>

  private constructor() {}

  public static getInstance(): InMemoryDomainEventPublisher {
    if (!InMemoryDomainEventPublisher.instance) {
      InMemoryDomainEventPublisher.instance =
        new InMemoryDomainEventPublisher();
    }
    return InMemoryDomainEventPublisher.instance;
  }

  publish(
    aggregateRootId: UniqueUUID,
    domainEvent: IDomainEvent
  ): Promise<void> {
    const aggregateRootIndex = this.findAggregateRootIndex(aggregateRootId);
    if (aggregateRootIndex === -1) {
      this.pendingEvents.push({
        id: aggregateRootId,
        pendingEvents: [domainEvent]
      });
    } else {
      this.pendingEvents[aggregateRootIndex].pendingEvents.push(domainEvent);
    }
    return Promise.resolve();
  }

  registerHandler<T extends IDomainEvent>(
    domainEventHandler: IDomainEventHandler<T>,
    domainEventName: string
  ): void {
    if (!this.handlers.has(domainEventName)) {
      this.handlers.set(domainEventName, []);
    }
    this.handlers.get(domainEventName).push(domainEventHandler);
  }

  getAggregateRootEvents(aggregateRootId: UniqueUUID): IDomainEvent[] {
    const aggregateRootIndex = this.findAggregateRootIndex(aggregateRootId);
    if (aggregateRootIndex === -1) {
      return [];
    }
    return this.pendingEvents[aggregateRootIndex].pendingEvents;
  }

  async dispatchAggregateRootEvents(
    aggregateRootId: UniqueUUID
  ): Promise<void> {
    const aggregateRootIndex = this.findAggregateRootIndex(aggregateRootId);
    if (aggregateRootIndex === -1) {
      return Promise.resolve();
    }

    const aggregateRoot = this.pendingEvents[aggregateRootIndex];

    const promises = aggregateRoot.pendingEvents.map(domainEvent => {
      const handlers = this.handlers.get(domainEvent.eventName);
      if (!handlers) {
        return Promise.resolve();
      }
      return Promise.all(handlers.map(handler => handler.handle(domainEvent)));
    });

    await Promise.all(promises);

    this.clearAggregateRootEvents(aggregateRootId);
  }

  async dispatchAggregateRootEventByName(
    aggregateRootId: UniqueUUID,
    eventName: string
  ): Promise<void> {
    const aggregateRootIndex = this.findAggregateRootIndex(aggregateRootId);
    if (aggregateRootIndex === -1) {
      return Promise.resolve();
    }

    const aggregateRoot = this.pendingEvents[aggregateRootIndex];

    const promises = aggregateRoot.pendingEvents
      .filter(domainEvent => domainEvent.eventName === eventName)
      .map(domainEvent => {
        const handlers = this.handlers.get(domainEvent.eventName);
        if (!handlers) {
          return Promise.resolve();
        }
        return Promise.all(
          handlers.map(handler => handler.handle(domainEvent))
        );
      });

    await Promise.all(promises);
    this.clearAggregateRootEvents(aggregateRootId);
  }

  clearAggregateRootEvents(aggregateRootId: UniqueUUID): void {
    const aggregateRootIndex = this.findAggregateRootIndex(aggregateRootId);
    if (aggregateRootIndex !== -1) {
      this.pendingEvents.splice(aggregateRootIndex, 1);
    }
  }

  findAggregateRootIndex<T>(aggregateRootId: UniqueUUID): number {
    const aggregateRootIndex = this.pendingEvents.findIndex(aggregateRoot =>
      aggregateRoot.id.equals(aggregateRootId)
    );
    return aggregateRootIndex;
  }
}
