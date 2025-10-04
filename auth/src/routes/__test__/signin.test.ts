import  request  from "supertest";
import {app} from '../../app'

it('fails when a email that doe not exists is given',async()=>{
    return request(app)
    .post('/api/users/signin')
    .send({
        email: "random1@tet.com",
        password:"paddword"
    })
    .expect(400);
});

it('it fails when an incorrect password is given',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: "random2@tet.com",
        password:"paddword"
    })
    .expect(201);

    await request(app)
    .post('/api/users/signin')
    .send({
        email: "random2@tet.com",
        password:"padword"
    })
    .expect(400);
});

it('responds with a cookie when every detail is correct',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: "random3@tet.com",
        password:"paddword"
    })
    .expect(201);

    const response= await request(app)
    .post('/api/users/signin')
    .send({
        email: "random3@tet.com",
        password:"paddword"
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});
