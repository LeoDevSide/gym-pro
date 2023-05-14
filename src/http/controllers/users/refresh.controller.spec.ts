import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'

describe('Refresh controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to refresh a token', async () => {
    const registerResponse = await agent(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'randompass',
    })
    expect(registerResponse.statusCode).toBe(201)
    const authResponse = await agent(app.server)
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: 'randompass',
      })
      .set('accept', 'application/json')
    expect(authResponse.statusCode).toBe(200)
    expect(authResponse.body).toEqual({
      token: expect.any(String),
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await agent(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')[0]).toEqual(
      expect.stringContaining('refreshToken'),
    )
  })
})
