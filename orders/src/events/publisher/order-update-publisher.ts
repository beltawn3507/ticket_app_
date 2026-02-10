import {
  Publisher,
  OrderUpdatedEvent,
  Subjects,
} from '@beltawnticket/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}