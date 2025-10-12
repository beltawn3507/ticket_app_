import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('return a 404 if provided id does not exist',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = await global.signin()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',cookie)
        .send({
            title:'dfdfd',
            price:70
        })
        .expect(404)
})

it('return a 401 if not authenticated',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:'dfdfd',
            price:70
        })
        .expect(401)
})

it('return a 401 if user does not own a ticket',async()=>{
    const cookie1 = await global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie1)
        .send({
            title:'dgdfgdfg',
            price:10
        })
        .expect(201)

    const cookie2 = await global.signin()
    
    await request(app)
        .put(`/api/tickets/${response.body._id}`)
        .set('Cookie',cookie2)
        .send({
            title:'dfdfd',
            price:70
        })
        .expect(401)
})

it('return a 400 if the user provide an invalid title or price',async()=>{
    const cookie1 = await global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie1)
        .send({
            title:'dgdfgdfg',
            price:10
        })
        .expect(201)

     await request(app)
        .put(`/api/tickets/${response.body._id}`)
        .set('Cookie',cookie1)
        .send({
            title:'',
            price:70
        })
        .expect(400)

     await request(app)
        .put(`/api/tickets/${response.body._id}`)
        .set('Cookie',cookie1)
        .send({
            title:'dfdfd',
            price:-70
        })
        .expect(400)
    
})

it('update the ticket provided and valid title or price',async()=>{
    const cookie1 = await global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie1)
        .send({
            title:'dgdfgdfg',
            price:10
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body._id}`)
        .set('Cookie',cookie1) 
        .send({
            title:'dfdfd',
            price:70
        })
        .expect(200)

    const ticketresponse = await request(app)
            .get(`/api/tickets/${response.body._id}`)
            .send()
            .expect(200);
    
      expect(ticketresponse.body.title).toEqual('dfdfd')      
      expect(ticketresponse.body.price).toEqual(70)  

    
    
})