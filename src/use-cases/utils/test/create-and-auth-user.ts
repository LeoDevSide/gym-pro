import { agent } from 'supertest'
import { FastifyInstance } from 'fastify'

export default async function createAndAuthRandomUser(app: FastifyInstance) {
  await agent(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'randompass',
  })
  const authResponse = await agent(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: 'randompass',
  })
  const { token } = authResponse.body
  return { token }
}
