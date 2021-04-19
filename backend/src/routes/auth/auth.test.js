import request from "supertest";
import app from "../../bin/www";
import mongoose from 'mongoose';

let agent = request.agent(app)

describe('Authentication test', () => {
  let bearerToken = "";

  it('should authenticate as admin', async (done) => {
    const res = await agent
      .post('/auth')
      .auth('admin', 'admin')
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('authorization');
    expect(res.header.authorization.split(' ')[0]).toEqual('Bearer')
    
    bearerToken = res.header.authorization;
    done()
  })

  it('test 2', async (done) => {
    const res = await agent
      .set("Authorization", bearerToken)
      .get('/users')
      .send()

    expect(res.statusCode).toEqual(200)
    done();
  })
})

afterAll(async () => {
  mongoose.connection.close()
  app.close()
});