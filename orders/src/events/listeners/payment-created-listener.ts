import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@beltawnticket/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupname = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if(order.status === OrderStatus.Cancelled){
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Complete,
    });
    
    await order.save();

    msg.ack();
  }
}
