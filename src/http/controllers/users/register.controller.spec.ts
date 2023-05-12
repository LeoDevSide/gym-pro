import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'

describe('Register controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to register without error', async () => {
    const response = await agent(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'randompass',
    })
    expect(response.statusCode).toBe(201)
  })
})
