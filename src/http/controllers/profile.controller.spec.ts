import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../app'

describe('profile controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user profile from authenticated user', async () => {
    const registerResponse = await agent(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'randompass',
    })
    expect(registerResponse.statusCode).toBe(201)
    const authResponse = await agent(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: 'randompass',
    })
    expect(authResponse.statusCode).toBe(200)
    expect(authResponse.body).toEqual({
      token: expect.any(String),
    })
    const profileResponse = await agent(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user.id).toBeDefined()
    expect(profileResponse.body.user.name).toEqual('John Doe')
    expect(profileResponse.body.user.email).toEqual('johndoe@example.com')
    expect(profileResponse.body.user.created_at).toBeDefined()
  })
})
