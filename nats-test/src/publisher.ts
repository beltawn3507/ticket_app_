import nats,{Message} from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()

const stan = nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
});


stan.on('connect',async ()=>{
    console.log('publisher connected to nats');
    
    const data=JSON.stringify({
        id:'34',
        title:"Concert",
        price: 20
    });
  
    const publisher = new TicketCreatedPublisher(stan);

    await publisher.publish({
        id:'dadasa',
        title:'concert',
        price:89
    })
              
});


 



