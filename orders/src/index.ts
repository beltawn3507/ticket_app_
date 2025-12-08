import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on('SIGINT',()=>natsWrapper.client.close());
    process.on('SIGTERM',()=>natsWrapper.client.close());

    // listener of ticketcreated 
    new TicketCreatedListener(natsWrapper.client).listen();
    // listener of ticket upadted
    new TicketUpdatedListener(natsWrapper.client).listen();
    // listener for expiration of order complete 
    new ExpirationCompleteListener(natsWrapper.client).listen();
    // payment completed litener 
    new PaymentCreatedListener(natsWrapper.client).listen();

    // mongoose 
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo-db", process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("listening on port 3000 .!");
  });
};

start();
