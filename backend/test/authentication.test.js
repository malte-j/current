import request from "supertest";
import { exec } from "child_process";
import app from "../src/bin/www";

let agent = request.agent(app)

describe('Authenticate', () => {
  it('should create a new post', async () => {
    const res = await agent
      .post('/auth')
      .auth('admin', 'admin')
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('authorization');
  })
})

afterAll(async () => {
  app.close();
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});