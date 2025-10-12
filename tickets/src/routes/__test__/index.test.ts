import request from "supertest"
import {app} from "../../app"
import mongoose from "mongoose";

const createTicket=async()=>{
    const price = 20;
    const title = 'dfdfd';
    const cookie = await global.signin()
    request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:title,
            price:price
        })
        
}

it('it can fetch all ticket',async()=>{
    const price = 20;
    const title = 'dfdfd';
    const cookie = await global.signin()
    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:title,
            price:price
        })
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:title,
            price:price
        })
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:title,
            price:price
        })

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);
    
    expect(response.body.length).toEqual(3);
    
})







