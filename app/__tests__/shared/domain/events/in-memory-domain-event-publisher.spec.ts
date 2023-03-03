import { InMemoryDomainEventPublisher } from '@shared/domain/events/InMemoryDomainEventPublisher';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';
import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';
import { DomainEventBase } from '@shared/domain/events/DomainEventBase';

const mockDomainEvent = (
  aggregateId: UniqueUUID,
  name?: string
): IDomainEvent => {
  return {
    _id: UniqueUUID.generate(),
    _eventName: name ?? 'MockEvent',
    _occurredAt: DateTimeValueObject.now(),
    get id(): UniqueUUID {
      return this._id;
    },
    get name(): string {
      return this._eventName;
    },
    get occurredAt(): DateTimeValueObject {
      return this._occurredAt;
    },
    get aggregateRootId(): UniqueUUID {
      return aggregateId;
    },
    equals(other: IDomainEvent): boolean {
      return (
        this.id.equals(other.id) &&
        this.name === other.name &&
        this.aggregateRootId.equals(other.aggregateRootId)
      );
    }
  };
};

describe('InMemoryDomainEventPublisher', () => {
  let publisher: InMemoryDomainEventPublisher;
  let aggregateRootId: UniqueUUID;

  const mockEvent: IDomainEvent = mockDomainEvent(aggregateRootId);

  beforeEach(() => {
    publisher = InMemoryDomainEventPublisher.getInstance();
    aggregateRootId = UniqueUUID.generate();
  });

  afterEach(() => {
    publisher.clearAggregateRootEvents(mockEvent.aggregateRootId);
  });

  it('InMemoryDomainEventPublisher should be a singleton', () => {
    const publisher2 = InMemoryDomainEventPublisher.getInstance();
    expect(publisher).toBe(publisher2);
  });

  it('should publish an event', async () => {
    await publisher.publish(mockEvent);
    expect(publisher.getAggregateRootEvents(aggregateRootId).length).toBe(1);
  });

  it('should publish an event only once', async () => {
    await publisher.publish(mockEvent);
    await publisher.publish(mockEvent);
    expect(publisher.getAggregateRootEvents(aggregateRootId).length).toBe(1);
  });

  it('should get all events for an aggregate root', async () => {
    await publisher.publish(mockEvent);
    const mockEvent2: DomainEventBase = mockDomainEvent(
      aggregateRootId,
      'MockEvent2'
    );

    await publisher.publish(mockEvent2);
    expect(publisher.getAggregateRootEvents(aggregateRootId).length).toBe(2);
  });

  it('should clear all events for an aggregate root', async () => {
    await publisher.publish(mockEvent);
    publisher.clearAggregateRootEvents(aggregateRootId);
    expect(publisher.getAggregateRootEvents(aggregateRootId).length).toBe(0);
  });

  it('should register a handler for an event', () => {
    const mockHandler: IDomainEventHandler<IDomainEvent> = {
      handle: jest.fn(),
      subscribeTo: jest.fn()
    };
    publisher.registerHandler(mockHandler, mockEvent.name);
    expect(publisher.handlers.size).toBe(1);
    expect(publisher.handlers.get(mockEvent.name).length).toBe(1);
  });

  it('should dispatch all events for an aggregate root', async () => {
    const mockHandler: IDomainEventHandler<IDomainEvent> = {
      handle: jest.fn(),
      subscribeTo: jest.fn()
    };
    publisher.registerHandler(mockHandler, mockEvent.name);
    await publisher.publish(mockEvent);
    await publisher.dispatchAggregateRootEvents(aggregateRootId);
    expect(mockHandler.handle).toBeCalledTimes(1);
  });

  it('should dispatch all events for an aggregate root only once', async () => {
    const mockHandler: IDomainEventHandler<IDomainEvent> = {
      handle: jest.fn(),
      subscribeTo: jest.fn()
    };
    publisher.registerHandler(mockHandler, mockEvent.name);
    await publisher.publish(mockEvent);
    await publisher.dispatchAggregateRootEvents(aggregateRootId);
    await publisher.dispatchAggregateRootEvents(aggregateRootId);
    expect(mockHandler.handle).toBeCalledTimes(1);
  });
});
