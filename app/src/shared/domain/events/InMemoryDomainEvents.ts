import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';
import { IDomainEventPublisher } from '@shared/domain/interfaces/IDomainEventPublisher';

export class InMemoryDomainEvents implements IDomainEventPublisher {
  private static instance: InMemoryDomainEvents;
  private readonly aggregateRoots = new Map<string, IDomainEvent[]>(); // <aggregateRootId, events[]>
  private readonly handlers = new Map<
    string,
    IDomainEventHandler<IDomainEvent>[]
  >(); // <IDomainEvent.name, handlers[]>

  private constructor() {}

  public static getInstance(): InMemoryDomainEvents {
    if (!InMemoryDomainEvents.instance) {
      InMemoryDomainEvents.instance = new InMemoryDomainEvents();
    }
    return InMemoryDomainEvents.instance;
  }

  public async publish(domainEvent: IDomainEvent): Promise<void> {
    const aggregateRootId = domainEvent.aggregateRootId.toString();
    const aggregateRootEvents = this.aggregateRoots.get(aggregateRootId) ?? [];
    aggregateRootEvents.push(domainEvent);
    this.aggregateRoots.set(aggregateRootId, aggregateRootEvents);
  }

  public async publishMany(domainEvents: IDomainEvent[]): Promise<void> {
    for (const domainEvent of domainEvents) {
      await this.publish(domainEvent);
    }
  }

  public registerHandler<T extends IDomainEvent>(
    domainEventHandler: IDomainEventHandler<T>,
    domainEventName: string
  ): void {
    const handlers = this.handlers.get(domainEventName) ?? [];
    handlers.push(domainEventHandler);
    this.handlers.set(domainEventName, handlers);
  }

  public async dispatchAggregateRootEvents(aggregateRootId: UniqueUUID) {
    const aggregateRootEvents = this.getAggregateRootEvents(aggregateRootId);

    for (const domainEvent of aggregateRootEvents) {
      const handlers = this.handlers.get(domainEvent.eventName) ?? [];
      for (const handler of handlers) {
        await handler.handle(domainEvent);
      }
    }
  }

  public getAggregateRootEvents(aggregateRootId: UniqueUUID): IDomainEvent[] {
    return this.aggregateRoots.get(aggregateRootId.value) ?? [];
  }

  public clearAggregateRootEvents(aggregateRootId: UniqueUUID): void {
    this.aggregateRoots.delete(aggregateRootId.value);
  }

  public clearAll(): void {
    this.aggregateRoots.clear();
  }
}
