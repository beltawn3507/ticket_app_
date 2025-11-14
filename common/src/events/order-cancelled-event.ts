import { Subjects } from "./subjects";

// data we will send via event bus
export interface OrderCancelledEvent{
    subject: Subjects.OrderCancelled;
    data:{
        id:string;
        ticket:{
            id:string;
        }
    };
}