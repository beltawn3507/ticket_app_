import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@beltawnticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";






export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    // this is the name of the subject queue
    subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
    // multiple instances of payment service 
    // nats server will send the message to only one of the pod
    queueGroupname = queueGroupName;

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        // find the order from the Order DB
        const order = await Order.findOne({
            _id: data.id,
            version: data.version-1,
        });

        if(!order){
            throw new Error('Order Not Found');
        }
        // set the status to be cancelled
        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }   
}