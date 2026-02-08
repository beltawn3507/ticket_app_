import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@beltawnticket/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpadatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupname = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const quantity = data.quantity;

    if(ticket.reservedQuantity + quantity > ticket.totalQuantity){
      throw new Error('Not Enough Tickets available')
    }

    ticket.set({ reservedQuantity: ticket.reservedQuantity + quantity, });

    await ticket.save();
    await new TicketUpadatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      description: ticket.description,
      totalQuantity: ticket.totalQuantity,
      reservedQuantity: ticket.reservedQuantity,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
