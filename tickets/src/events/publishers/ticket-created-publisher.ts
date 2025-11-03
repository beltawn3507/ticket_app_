import {Publisher, Subjects , TicketCreatedEvent} from '@beltawnticket/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject : Subjects.TicketCreated = Subjects.TicketCreated;
}

// we can use this to
// new TicketCreatedPublisher(client).publish(data);