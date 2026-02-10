import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@beltawnticket/common';

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  quantity: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
  quantity: number;
  totalAmount(): number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
  },
  {
    toJSON: {
      transform(doc, ret:any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.methods.totalAmount = function () {
  return this.price * this.quantity;
};

orderSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
    quantity: attrs.quantity,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };