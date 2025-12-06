import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@beltawnticket/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
