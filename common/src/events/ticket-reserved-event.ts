import { Subjects } from './subjects';

export interface TicketsReservedEvent {
  subject: Subjects.TicketsReserved;
  data: {
    orderId: string;
    ticketId:string;
    version:number;
    quantity:number;
  };
}