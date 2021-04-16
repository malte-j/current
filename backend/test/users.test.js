import request from "supertest";
import app from "../src/bin/www";

let agent = request.agent(app)

describe('Create a new user', () => {
  it('creates a new user', async () => {
    const res = await agent
      .post('/users')
      .send({
        username: "testusr1",
        email: "testusr1@example.com",
        password: "awnd3941b4012124"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('authorization');
  })
})

afterAll(async () => {
  app.close();
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});