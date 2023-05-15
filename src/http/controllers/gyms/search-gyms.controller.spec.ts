import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'
import createAndAuthRandomUser from '../../../use-cases/utils/test/create-and-auth-user'

describe('Search gyms controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get gyms with search string in title', async () => {
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
    await agent(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        title: 'Gym goku',
        latitude: 1,
        longitude: 2.2,
        description: null,
        phone: null,
      })
    await agent(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        title: 'ginasio goku',
        latitude: 1,
        longitude: 2.2,
        description: null,
        phone: null,
      })
    const fetchGymsBySearchString = await agent(app.server)
      .get('/gyms/search')
      .query({ search: 'Gym' })
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        userLatitude: 1,
        userLongitude: 2.2224,
      })
    expect(fetchGymsBySearchString.statusCode).toBe(200)
    expect(fetchGymsBySearchString.body.gyms.length).toBe(2)
  })
})
