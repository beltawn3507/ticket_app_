import nats, { Message,Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

// created a nats client 
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http:/localhost:4222",
}); 

// on connection of the client to the server
stan.on("connect", () => {
  console.log("listener connected to nats");

  stan.on('close',()=>{
    console.log('NATS connection closed');
    process.exit();
  })
  
 
    new TicketCreatedListener(stan).listen();
});

process.on('SIGINT',()=>stan.close());
process.on('SIGTERM',()=>stan.close())

