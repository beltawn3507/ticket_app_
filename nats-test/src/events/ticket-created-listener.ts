import nats, { Message,Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject:Subjects.TicketCreated =Subjects.TicketCreated
  queueGroupname='payments-service';

  onMessage(data:TicketCreatedEvent['data'],msg:Message){
      console.log('Event Data!',data);

      console.log(data.price);
      console.log(data.title);
      msg.ack(); 
  }
}