import { Publisher,OrderCancelledEvent,Subjects } from "@beltawnticket/common";

// child class to base publisher

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}



