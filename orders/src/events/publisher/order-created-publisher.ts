import { Publisher,OrderCreatedEvent,Subjects } from "@beltawnticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}



