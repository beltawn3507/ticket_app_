import nats, { Message,Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
// custom class of listener which will have a client 
// here we provide it with all the configurations 

interface Event{
  subject:Subjects;
  data:any;
}


export abstract class Listener<T extends Event>{
    // abstract variable means we have to define thee value in
    // child objects
   abstract subject: T['subject'];
   abstract queueGroupname: string;
   abstract onMessage(data:T['data'],msg:Message):void;
   private client:Stan; 
   protected ackwait = 5*1000;

  //  constructor of the object
  // we provide a nat client which is connected to the nats server
   constructor(client:Stan){
    this.client = client;
   }

//    concrete subsrciption options
   subscriptionOption(){
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackwait)
      .setDurableName(this.queueGroupname);
   }

  //  concrete function to listen to create a subscription and 
  //   then on message setup a funcion
  // we will call a onMessage function which should be defined in the children class
   listen(){
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupname,
      this.subscriptionOption()
    );

    subscription.on('message',(msg:Message)=>{
      console.log(`Message receive ${this.subject} / ${this.queueGroupname}`);
      const parseData = this.parseMessage(msg);
      // calling an abstract function 
      this.onMessage(parseData,msg);
    });

   }

  //  concrete function to parse message
   parseMessage(msg:Message){
    const data = msg.getData();
    return typeof data==='string'
      ?JSON.parse(data)
      :JSON.parse(data.toString('utf8'));
   }
};