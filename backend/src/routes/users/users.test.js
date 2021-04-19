import request from 'supertest';
import app from '../../bin/www';
import mongoose from 'mongoose';

let agent = request.agent(app);


describe('User flow', () => {
  let bearerToken = '';
  let user = {};

  it('should create a new user', async (done) => {
    const res = await agent
      .post('/users')
      .send({
        username: 'exampleuser',
        email: 'demo@example.com',
        password: 'examplepasswordthatslong'
      });

    bearerToken = res.header.authorization;
    user = res.body;  

    expect(res.statusCode).toEqual(200);
    expect(res.header).toHaveProperty('authorization');
    expect(res.header.authorization.split(' ')[0]).toEqual('Bearer');
    expect(res.body.email).toEqual('demo@example.com');
    expect(res.body.emailVerified).toEqual(false);
    expect(res.body.username).toEqual('exampleuser');

    done();
  });

  it('login the new user', async (done) => {
    const res = await agent
      .set('Authorization', bearerToken)
      .get('/users')
      .send();

    expect(res.statusCode).toEqual(200);

    done();
  });

  it('changes the password of the user', async (done) => {

    const requestUrl = `/users/${user.id}`;

    const res = await agent
      .set('Authorization', bearerToken)
      .patch(requestUrl)
      .send({
        password: 'atleast8characters'
      });

    expect(res.statusCode).toEqual(200);

    done();
  });

  it('failes changes password because it is too short', async (done) => {

    const requestUrl = `/users/${user.id}`;

    const res = await agent
      .set('Authorization', bearerToken)
      .patch(requestUrl)
      .send({
        password: '6chars'
      });

    expect(res.statusCode).toEqual(400);

    done();
  });

  it('deletes the user', async (done) => {

    const requestUrl = `/users/${user.id}`;

    const res = await agent
      .set('Authorization', bearerToken)
      .delete(requestUrl)
      .send();

    expect(res.statusCode).toEqual(200);

    done();
  });
});

afterAll(async () => {
  app.close();
  mongoose.connection.close();
});