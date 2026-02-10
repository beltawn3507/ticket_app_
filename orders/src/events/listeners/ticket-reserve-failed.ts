import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import {
  Listener,
  Subjects,
  TicketsReserveFailedEvent,
  OrderStatus,
} from '@beltawnticket/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publisher/order-cancelled-publisher';

export class TicketsReservationFailedListener extends Listener<TicketsReserveFailedEvent> {
  subject: Subjects.TicketsReservationFailed =
    Subjects.TicketsReservationFailed;

  queueGroupname = queueGroupName;

  async onMessage(
    data: TicketsReserveFailedEvent['data'],
    msg: Message
  ) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      msg.ack();
      return;
    }

    if (order.status !== OrderStatus.Created) {
      msg.ack();
      return;
    }

    // ---- normalize ticketId SAFELY ----
    let ticketId: string;

    if (typeof order.ticket === 'string') {
      ticketId = order.ticket;
    } else if (order.ticket instanceof mongoose.Types.ObjectId) {
      ticketId = order.ticket.toHexString();
    } else if (
      order.ticket &&
      typeof order.ticket === 'object' &&
      'id' in order.ticket
    ) {
      ticketId = order.ticket.id;
    } else {
      throw new Error('Unable to resolve ticketId from order');
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new Error(`Invalid ticketId while cancelling order: ${ticketId}`);
    }
    // ----------------------------------

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: ticketId,
      },
      quantity: order.quantity,
      version: order.version,
    });

    msg.ack();
  }
}