import {Publisher,Subjects,TicketsReservedEvent} from "@beltawnticket/common"

export class TicketReservedPublisher extends Publisher<TicketsReservedEvent>{
    subject : Subjects.TicketsReserved = Subjects.TicketsReserved;
}