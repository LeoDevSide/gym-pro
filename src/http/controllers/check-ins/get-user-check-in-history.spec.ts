import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'
import createAndAuthRandomUser from '../../../use-cases/utils/test/create-and-auth-user'
import { prisma } from '../../../lib/prisma'

describe('Get User History CheckIn controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to fetch check ins from a uuser', async () => {
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
    const fetchCheckIns = await agent(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${userCreated.token}`)
      .send()
    expect(fetchCheckIns.body.checkIns.length).toEqual(1)
  })
})
