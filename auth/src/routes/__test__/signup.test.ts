import  request  from "supertest";
import {app} from '../../app'

it('returns a 201 on sucessfull signup',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email: "tet@tet.com",
        password:"paddword"
    })
    .expect(201);
});

it('returns a 400 with an invalid email',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email: "tetdadat.com",
        password:"paddword"
    })
    .expect(400);
});

it('returns a 400 with an invalid password',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email: "tetdadat@gmail.com",
        password:"pa"
    })
    .expect(400);
});

it('returns a 400 with an missing email and password',async()=>{
    
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'dfdfd@gmol.com',
        password:""
    })
    .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:"",
        password:"sdfsdfs"
    })
    .expect(400);
});

it('disallow duplicate email',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: "tetdadat@gmail.com",
        password:"password"
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email: "tetdadat@gmail.com",
        password:"password"
    })
    .expect(400);
});

it('set a cookie after sucessful signup',async()=>{
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: "tettet@gmail.com",
        password:"pawwdord"
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined()
});

