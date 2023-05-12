import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'
import createAndAuthRandomUser from '../../../use-cases/utils/test/create-and-auth-user'
import { prisma } from '../../../lib/prisma'

describe('Create CheckIn controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be create a new check in in a existent gym', async () => {
    const userCreated = await createAndAuthRandomUser(app)

    const createGym = await prisma.gym.create({
      data: {
        title: 'gym doe',
        latitude: 1,
        longitude: 2.2,
        description: null,
        phone: null,
      },
    })
    const createCheckIn = await agent(app.server)
      .post(`/gyms/${createGym.id}/check-ins`)
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send({
        userLatitude: 1,
        userLongitude: 2.2,
      })
    expect(createCheckIn.statusCode).toBe(201)

    const response = await agent(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.checkInsCount).toEqual(1)
  })
})
