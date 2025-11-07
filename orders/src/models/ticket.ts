import mongoose from "mongoose";
import { OrderStatus } from "@beltawnticket/common";
import { Order } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;

}


export interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
    price:{
        type: Number,
        required: true,
        min:0
    },
    title:{
        type:String,
        required:true,
    }
},{
    toJSON:{
        transform(doc:any,ret:any){
            ret.id=ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs:TicketAttrs)=>{
    return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
            ticket: this,
            status:{
                $in: [
                    OrderStatus.Created,
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Complete
                ]
            }
        });
    
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export {Ticket}

