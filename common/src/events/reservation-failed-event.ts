import { Subjects } from './subjects';

export interface TicketsReserveFailedEvent {
  subject: Subjects.TicketsReservationFailed;
  data: {
    orderId: string;
    ticketId: string;
    reason: 'already_reserved' | 'not_found';
    version: number;
};
}