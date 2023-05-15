import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'
import createAndAuthRandomUser from '../../../use-cases/utils/test/create-and-auth-user'

describe('Register controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be create a new gym', async () => {
    const userCreated = await createAndAuthRandomUser(app, true)

    const response = await agent(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        title: 'Gym Doe',
        latitude: 1,
        longitude: 2,
        description: null,
        phone: null,
      })
    expect(response.statusCode).toBe(201)
  })
})
