import request from "supertest";
import app from "../../bin/www";
import mongoose from 'mongoose';
import config from '../../config';

let agent = request.agent(app)

describe("", () => {
  let bearerToken = "";

  it('should authenticate as admin', async (done) => {
    const res = await agent
      .post('/auth')
      // @TODO change to config
      .auth(config.admin.email, config.admin.password)
      .send()

    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('authorization');
    expect(res.header.authorization.split(' ')[0]).toEqual('Bearer')
    
    bearerToken = res.header.authorization;
    done()
  })

  it('should upload an image', async () => {
    const res = await agent
    .post('/images')
    .set("Authorization", bearerToken)
    .attach('image', process.cwd() + '/test/example.jpg')
    
    expect(res.statusCode).toEqual(200)
  })
})

afterAll(async () => {
  app.close();
  mongoose.connection.close();
});