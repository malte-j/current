import request from "supertest";
import app from "../src/bin/www";

let agent = request.agent(app)

describe('Authenticate', () => {
  it('should create a new post', async (done) => {
    const res = await agent
      .post('/auth')
      .auth('admin', 'admin')
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.header).toHaveProperty('authorization');
    done()
  })
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});