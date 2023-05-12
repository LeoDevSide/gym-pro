import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../app'

describe('authenticate controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to authenticate after user register', async () => {
    const registerResponse = await agent(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'randompass',
    })
    expect(registerResponse.statusCode).toBe(201)
    const { body, statusCode } = await agent(app.server)
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: 'randompass',
      })
      .set('accept', 'application/json')
    console.log(body)
    expect(statusCode).toBe(200)
    expect(body).toEqual({
      token: expect.any(String),
    })
  })
})
