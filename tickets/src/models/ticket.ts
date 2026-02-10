import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface Reservation {
  orderId: string;
  quantity: number;
}

interface TicketAttrs{
    title: string;
    description:string;
    price: number;
    totalQuantity: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    description:string;
    totalQuantity:number;
    reservedQuantity:number;
    reservations: Reservation[];
    id: string;
    version:number;
}


interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs :TicketAttrs):TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type:Number,
        required:true
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    reservedQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    reservations: [
      {
        orderId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    userId:{
        type:String,
        required:true
    }
}, { 
    toJSON: {
        transform(doc:any, ret:any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build =(attrs: TicketAttrs)=>{
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export {Ticket};