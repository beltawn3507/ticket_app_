import express,{Request,Response} from 'express'
import {body} from 'express-validator'
import { NotAuthorisedError, NotFoundError, requireAuth , validateRequest} from '@beltawnticket/common'
import { Ticket } from '../models/ticket';
import { TicketUpadatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.put('/api/tickets/:id',requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({gt:0})
            .withMessage('Price must be greater than 0')
    ],validateRequest,
    async (req:Request,res:Response)=>{
    
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError()
    }    

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorisedError()
    }
    const {title,price} = req.body;
    
    ticket.set({
        title,
        price
    })
    await ticket.save();

    new TicketUpadatedPublisher(natsWrapper.client).publish({
        id:ticket.id,
        title:ticket.title,
        price:ticket.price,
        userId:ticket.userId,
        version:ticket.version
    })

    res.send(ticket);
})

export {router as updateTicketRouter}