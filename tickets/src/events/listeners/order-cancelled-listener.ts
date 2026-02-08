import { Listener, OrderCancelledEvent, Subjects } from '@beltawnticket/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpadatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupname = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const quantity = data.quantity;

    ticket.set({
      reservedQuantity:Math.max(
        ticket.reservedQuantity-quantity,
        0
      )
    })

    await ticket.save();

    await new TicketUpadatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      price: ticket.price,
      totalQuantity: ticket.totalQuantity,
      reservedQuantity: ticket.reservedQuantity,
      userId: ticket.userId,
      version: ticket.version,
    });

    msg.ack();
  }
}
