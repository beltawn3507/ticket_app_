import express ,{Request,Response} from 'express'
import { BadRequesterror, NotFoundError, OrderStatus, requireAuth,validateRequest } from '@beltawnticket/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import {Order} from '../models/order'
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15*60;

router.post('/api/orders',requireAuth,
    [
       body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId must be provided'),
       body('quantity')
        .isInt({ gt: 0 })
        .withMessage('Quantity must be greater than 0'),
    ],validateRequest,
    async(req:Request,res:Response)=>{

    const {ticketId,quantity} = req.body;
    // find the ticket the user is trying to order from db
        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError();
        }

   

    // calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the datbase
        const order = Order.build({
            userId:req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
            quantity,
            priceatPurchase:ticket.price
        });

        await order.save();
    // publish and event sayin that the order is created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            quantity: order.quantity,
            ticket:{
                id:ticket.id.toString(),
                price:ticket.price
            }
        });


    res.status(201).send(order);
})

export {router as newOrderRouter}
