import nats,{Message} from 'node-nats-streaming'

console.clear()

// creation of the nats client
const stan = nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
});
 
// on coonnection of the client to the server
stan.on('connect',()=>{
    console.log('publisher connected to nats');
    
    const data=JSON.stringify({
        id:'34',
        title:"Concert",
        price: 20
    });
     
    // publish the data on connection to the nats-server
    stan.publish('ticket:created',data,()=>{
        console.log('event published')
    });
              
});


 



