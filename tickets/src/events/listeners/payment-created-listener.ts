import { Listener, PaymentCreatedEvent, Subjects } from '@beltawnticket/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupname = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findOne({ orderId: data.orderId });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ isSold: true });

    await ticket.save();

    msg.ack();
  }
}
