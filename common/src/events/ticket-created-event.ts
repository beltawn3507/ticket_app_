import { Subjects } from "./subjects";

export interface TicketCreatedEvent{
    subject: Subjects.TicketCreated;
    data:{
        id:string;
        version: number;
        description:string;
        title:string;
        price:number;
        totalQuantity: number;
        userId:string;
    };
}