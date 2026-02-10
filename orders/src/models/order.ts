import mongoose from "mongoose";
import { OrderStatus } from "@beltawnticket/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt:Date;
  ticket:TicketDoc;
  quantity:number;
  priceatPurchase: number;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc;
}


interface OrderDoc extends mongoose.Document{
    id:string,
    userId: string;
    status: OrderStatus;
    expiresAt:Date;
    ticket:TicketDoc;
    quantity:number;
    priceatPurchase:number;
    version: number;
}

const orderSchema = new mongoose.Schema({
    userId:{ 
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:mongoose.Schema.Types.Date
    },
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket'
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    priceatPurchase:{
        type:Number,
        required:true,
        min:0,
    }
},{ 
    toJSON: {
        transform(doc:any, ret:any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

// we are defining a new function build which will take value 
// of type OrderAttrs and create new mongodb 
orderSchema.statics.build =(attrs:OrderAttrs)=>{
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema)

export {Order}