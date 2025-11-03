import {Publisher, Subjects , TicketUpdatedEvent} from '@beltawnticket/common'

export class TicketUpadatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject : Subjects.TicketUpdated = Subjects.TicketUpdated;
}

// we can use this to
// new TicketUpdatedPublisher(client).publish(data);