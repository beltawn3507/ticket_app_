import express,{Request,Response} from 'express'
import {body} from 'express-validator'
import { BadRequesterror, NotAuthorisedError, NotFoundError, requireAuth , validateRequest} from '@beltawnticket/common'
import { Ticket } from '../models/ticket';
import { TicketUpadatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.put('/api/tickets/:id',requireAuth,
    [
        body('title').not().isEmpty(),
        body('description').not().isEmpty(),
        body('price').isFloat({ gt: 0 }),
    ],validateRequest,
    async (req:Request,res:Response)=>{
    
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError()
    }    

    // if (ticket.orderId) {
    //   throw new BadRequesterror('Cannot edit a reserved ticket');
    // }

    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorisedError()
    }
    const {title,price,description} = req.body;
    
    ticket.set({
        title,
        price,
        description
    })
    await ticket.save();

    new TicketUpadatedPublisher(natsWrapper.client).publish({
        id:ticket.id.toString(),
        title:ticket.title,
        description: ticket.description,
        price: ticket.price,
        totalQuantity: ticket.totalQuantity,
        reservedQuantity:ticket.reservedQuantity,
        userId:ticket.userId,
        version:ticket.version
    })

    res.send(ticket);
})

export {router as updateTicketRouter}