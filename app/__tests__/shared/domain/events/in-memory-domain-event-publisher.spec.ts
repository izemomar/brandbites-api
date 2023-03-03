import { InMemoryDomainEventPublisher } from '@shared/domain/events/InMemoryDomainEventPublisher';
import { UniqueUUID } from '@shared/domain/value-objects/UniqueUUID';
import { IDomainEvent } from '@shared/domain/building-blocks/IDomainEvent';
import { IDomainEventHandler } from '@shared/domain/interfaces/IDomainEventHandler';
import { DateTimeValueObject } from '@shared/domain/value-objects/DateTimeValueObject';

describe('InMemoryDomainEventPublisher', () => {
  let publisher: InMemoryDomainEventPublisher;
  const mockEvent: IDomainEvent = {
    eventName: 'MockEvent',
    occurredAt: DateTimeValueObject.now(),
    aggregateRootId: new UniqueUUID()
  };

  beforeEach(() => {
    publisher = InMemoryDomainEventPublisher.getInstance();
  });

  afterEach(() => {
    publisher.clearAggregateRootEvents(mockEvent.aggregateRootId);
  });

  it('should be able to publish events', async () => {
    const aggregateRootId = mockEvent.aggregateRootId;
    await publisher.publish(aggregateRootId, mockEvent);
    const aggregateRootEvents =
      publisher.getAggregateRootEvents(aggregateRootId);

    expect(aggregateRootEvents).toHaveLength(1);
  });

  it('should be able to clear events', async () => {
    const aggregateRootId = mockEvent.aggregateRootId;
    await publisher.publish(aggregateRootId, mockEvent);
    publisher.clearAggregateRootEvents(aggregateRootId);
    const aggregateRootEvents =
      publisher.getAggregateRootEvents(aggregateRootId);
    expect(aggregateRootEvents).toHaveLength(0);
  });

  it('should be able to register and handle events', async () => {
    const mockHandler: IDomainEventHandler<IDomainEvent> = {
      handle: jest.fn(),
      subscribeTo: jest.fn()
    };
    publisher.registerHandler(mockHandler, mockEvent.eventName);

    const aggregateRootId = new UniqueUUID();
    await publisher.publish(aggregateRootId, mockEvent);
    await publisher.dispatchAggregateRootEvents(aggregateRootId);

    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
    expect(mockHandler.handle).toHaveBeenCalledWith(mockEvent);
  });

  it('should dispatch event by name', async () => {
    const mockHandler: IDomainEventHandler<IDomainEvent> = {
      handle: jest.fn(),
      subscribeTo: jest.fn()
    };

    publisher.registerHandler(mockHandler, mockEvent.eventName);

    const aggregateRootId = new UniqueUUID();
    await publisher.publish(aggregateRootId, mockEvent);
    await publisher.dispatchAggregateRootEventByName(
      aggregateRootId,
      mockEvent.eventName
    );

    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
    expect(mockHandler.handle).toHaveBeenCalledWith(mockEvent);
  });
});
