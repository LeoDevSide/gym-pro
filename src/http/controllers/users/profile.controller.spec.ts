import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { agent } from 'supertest'
import { app } from '../../../app'
import createAndAuthRandomUser from '../../../use-cases/utils/test/create-and-auth-user'

describe('profile controller [e2e] ', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user profile from authenticated user', async () => {
    const userCreated = await createAndAuthRandomUser(app)
    const profileResponse = await agent(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${userCreated.token}`)
    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user.id).toBeDefined()
    expect(profileResponse.body.user.name).toEqual('John Doe')
    expect(profileResponse.body.user.email).toEqual('admin@example.com')
    expect(profileResponse.body.user.created_at).toBeDefined()
  })
})
