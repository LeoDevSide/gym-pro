import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'
import createAndAuthRandomUser from '../../../use-cases/utils/test/create-and-auth-user'

describe('Get near gyms controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be get a created near gyms in 10km from user loc', async () => {
    const userCreated = await createAndAuthRandomUser(app, true)
    await agent(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        title: 'Gym Doe',
        latitude: 1,
        longitude: 2.2,
        description: null,
        phone: null,
      })
    const fetchNearGyms = await agent(app.server)
      .get('/gyms/neargyms')
      .set('Authorization', `Bearer ${userCreated.token}`)
      .query({
        latitude: 1,
        longitude: 2.2224,
      })
      .send()
    expect(fetchNearGyms.statusCode).toBe(200)
    expect(fetchNearGyms.body.gyms.length).toBe(1)
  })
  it('not should get created near gyms in more than 10km from user loc', async () => {
    const userCreated = await createAndAuthRandomUser(
      app,
      true,
      'test2@gmail.com',
    )

    await agent(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        title: 'Gym Doe',
        latitude: 1,
        longitude: 2.3,
        description: null,
        phone: null,
      })
    const fetchNearGyms = await agent(app.server)
      .get('/gyms/neargyms')
      .query({
        latitude: 1,
        longitude: 3,
      })
      .set('Authorization', `Bearer ${userCreated.token}`)

      .send()
    expect(fetchNearGyms.statusCode).toBe(200)
    expect(fetchNearGyms.body.gyms.length).toBe(0)
  })
})
