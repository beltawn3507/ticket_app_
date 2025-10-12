import request from "supertest"
import {app} from "../../app"
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it('return 404 if ticket is found',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send({})
        .expect(404);
})

it('returns the ticket if ticket is found',async()=>{
    const cookie = await global.signin()
    const price = 20;
    const title = 'dfdfd';
    const response =  await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:title,
            price:price
        })
        .expect(201)
    
    // console.log(response.body);

    const ticketresponse = await request(app)
        .get(`/api/tickets/${response.body._id}`)
        .send()
        .expect(200);

    expect(ticketresponse.body.title).toEqual(title);
    expect(ticketresponse.body.price).toEqual(price);
})







