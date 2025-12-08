import { Subjects, Publisher, PaymentCreatedEvent } from '@beltawnticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
