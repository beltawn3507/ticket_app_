import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  TicketsReservedEvent,
  OrderStatus,
} from '@beltawnticket/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderUpdatedPublisher } from '../publisher/order-update-publisher';

export class TicketsReservedListener extends Listener<TicketsReservedEvent> {
  subject: Subjects.TicketsReserved = Subjects.TicketsReserved;
  queueGroupname = queueGroupName;

  async onMessage(data: TicketsReservedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    
    if (!order) {
      msg.ack();
      return;
    }

    
    if (order.status !== OrderStatus.Created) {
      msg.ack();
      return;
    }

    order.set({
      status: OrderStatus.AwaitingPayment,
    });

    await order.save();

    await new OrderUpdatedPublisher(this.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      ticket: {
        id: order.ticket.id.toString(),
        price: order.ticket.price,
      },
      quantity: order.quantity,
      version: order.version,
    });

    msg.ack();
  }
}