import nats,{Message} from 'node-nats-streaming'

console.clear()

const stan = nats.connect('ticketing','abc',{
    url:'http://localhost:4222'
});
 
stan.on('connect',()=>{
    console.log('publisher connected to nats');
    
    const data=JSON.stringify({
        id:'34',
        title:"Concert",
        price: 20
    });
     
    stan.publish('ticket:created',data,()=>{
        console.log('event published')
    });
              
});


 



