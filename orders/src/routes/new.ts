import express ,{Request,Response} from 'express'
import { BadRequesterror, NotFoundError, OrderStatus, requireAuth,validateRequest } from '@beltawnticket/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import {Order} from '../models/order'

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15*60;

router.post('/api/orders',requireAuth,
    [
       body('ticketId')
        .not()
        .isEmpty()
        .withMessage('TicketId must be provided')
    ],validateRequest,
    async(req:Request,res:Response)=>{

    const {ticketId} = req.body;
    // find the ticket the user is trying to order from db
        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError();
        }

    // prebuilt mongo model method to find if the ticket is reserved or not 
    // we are defining the method in mongo model
    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequesterror('Ticket is already reserved');
    }

    // calculate the expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the datbase
        const order = Order.build({
            userId:req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();
    // publish and event sayin that the order is created



    res.status(201).send(order);
})

export {router as newOrderRouter}
