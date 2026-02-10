import {Publisher,Subjects,TicketsReserveFailedEvent} from "@beltawnticket/common"

export class TicketsReservationFailedPublisher extends Publisher<TicketsReserveFailedEvent>{
    subject : Subjects.TicketsReservationFailed = Subjects.TicketsReservationFailed;
}