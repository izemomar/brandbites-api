import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';
import { IDomainEventPublisher } from '@shared/domain/interfaces/IDomainEventPublisher';

export class InMemoryDomainEventPublisher implements IDomainEventPublisher {
  private static instance: InMemoryDomainEventPublisher;
  private readonly pendingEvents: IDomainEvent[] = [];

  private readonly _handlers = new Map<
    string,
    IDomainEventHandler<IDomainEvent>[]
  >(); // <IDomainEvent.name, handlers[]>

  private constructor() {}

  public get handlers(): Map<string, IDomainEventHandler<IDomainEvent>[]> {
    return this._handlers;
  }

  public static getInstance(): InMemoryDomainEventPublisher {
    if (!InMemoryDomainEventPublisher.instance) {
      InMemoryDomainEventPublisher.instance =
        new InMemoryDomainEventPublisher();
    }
    return InMemoryDomainEventPublisher.instance;
  }

  publish(domainEvent: IDomainEvent): Promise<void> {
    const exists = this.pendingEvents.some((_event: IDomainEvent) =>
      _event.equals(domainEvent)
    );

    if (!exists) {
      this.pendingEvents.push(domainEvent);
    }

    return Promise.resolve();
  }

  registerHandler<T extends IDomainEvent>(
    domainEventHandler: IDomainEventHandler<T>,
    domainEventName: string
  ): void {
    if (!this._handlers.has(domainEventName)) {
      this._handlers.set(domainEventName, []);
    }
    this._handlers.get(domainEventName).push(domainEventHandler);
  }

  getAggregateRootEvents(aggregateRootId: UniqueUUID): IDomainEvent[] {
    return (
      this.pendingEvents?.filter((domainEvent: IDomainEvent) =>
        domainEvent.aggregateRootId.equals(aggregateRootId)
      ) ?? []
    );
  }

  async dispatchAggregateRootEvents(
    aggregateRootId: UniqueUUID
  ): Promise<void> {
    const aggregateRootEvents = this.getAggregateRootEvents(aggregateRootId);
    if (aggregateRootEvents.length === 0) {
      return Promise.resolve();
    }

    const promises = aggregateRootEvents.map(domainEvent => {
      const _handlers = this._handlers.get(domainEvent.name);
      if (!_handlers) {
        return Promise.resolve();
      }
      return Promise.all(_handlers.map(handler => handler.handle(domainEvent)));
    });

    await Promise.all(promises);

    this.clearAggregateRootEvents(aggregateRootId);
  }

  async dispatchAggregateRootEventByName(
    aggregateRootId: UniqueUUID,
    eventName: string
  ): Promise<void> {
    const aggregateRootEvents = this.getAggregateRootEvents(aggregateRootId);

    if (aggregateRootEvents.length === 0) {
      return Promise.resolve();
    }

    const promises = aggregateRootEvents
      .filter(domainEvent => domainEvent.name === eventName)

      .map(domainEvent => {
        const _handlers = this._handlers.get(domainEvent.name);
        if (!_handlers) {
          return Promise.resolve();
        }
        return Promise.all(
          _handlers.map(handler => handler.handle(domainEvent))
        );
      });

    await Promise.all(promises);
    this.clearAggregateRootEvents(aggregateRootId);
  }

  clearAggregateRootEvents(aggregateRootId: UniqueUUID): void {
    const events = this.pendingEvents.filter(
      (domainEvent: IDomainEvent) =>
        !domainEvent.aggregateRootId.equals(aggregateRootId)
    );
    this.pendingEvents.splice(0, this.pendingEvents.length);
    this.pendingEvents.push(...events);
  }
}
