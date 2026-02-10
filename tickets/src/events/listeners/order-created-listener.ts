import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@beltawnticket/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpadatedPublisher } from "../publishers/ticket-updated-publisher";
import { TicketsReservationFailedPublisher } from "../publishers/ticket-reserve-failed";
import { TicketReservedPublisher } from "../publishers/ticket-reserved-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupname = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id );

    if (!ticket) {
      await new TicketsReservationFailedPublisher(this.client).publish({
        orderId: data.id,
        ticketId: data.ticket.id.toString(),
        reason: 'not_found',
        version: 0,
      });

      msg.ack();
      return;
    }

    const quantity = data.quantity;

    if (ticket.reservedQuantity + quantity > ticket.totalQuantity) {
      await new TicketsReservationFailedPublisher(this.client).publish({
        orderId: data.id,
        ticketId: ticket.id.toString(),
        reason: "not_found",
        version: ticket.version,
      });

      msg.ack();
      return;
    }
    // store the reservation state
    ticket.reservations.push({
      orderId: data.id,
      quantity,
    });

    ticket.set({ reservedQuantity: ticket.reservedQuantity + quantity });

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

    await new TicketReservedPublisher(this.client).publish({
      orderId: data.id,
      ticketId: ticket.id,
      quantity,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
